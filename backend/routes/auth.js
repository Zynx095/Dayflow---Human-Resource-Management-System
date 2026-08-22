import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/signin', async (req, res) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
    }

    const { email, password } = parsed.data;
    const db = await getDb();

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get employee details if they exist
    const employee = await db.get('SELECT id as employee_id, name FROM employees WHERE user_id = ?', [user.id]);

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        employee_id: employee ? employee.employee_id : null
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: employee?.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signout', authenticateToken, (req, res) => {
  // Since we use JWT in headers, signout is mostly a client-side action (deleting token).
  // We can just return success here.
  res.json({ message: 'Signed out successfully' });
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
    const employee = await db.get('SELECT * FROM employees WHERE user_id = ?', [req.user.id]);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ user, employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function generateLoginId(db, firstName, lastName) {
  const companyInitials = "OI";
  const nameInitials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  const year = new Date().getFullYear();
  
  const countRow = await db.get(`SELECT COUNT(*) as count FROM users WHERE strftime('%Y', created_at) = ?`, [year.toString()]);
  const serial = (countRow.count + 1).toString().padStart(4, '0');
  
  return `${companyInitials}${nameInitials}${year}${serial}`;
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().optional()
});

router.post('/signup', async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
    }

    const { email, password, firstName, lastName, role } = parsed.data;
    const db = await getDb();

    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const login_id = await generateLoginId(db, firstName, lastName);
    const userRole = role || 'employee';

    const result = await db.run(
      'INSERT INTO users (email, password_hash, role, login_id) VALUES (?, ?, ?, ?)',
      [email, password_hash, userRole, login_id]
    );

    const name = `${firstName} ${lastName}`;
    await db.run(
      'INSERT INTO employees (employee_id, user_id, name, email, role, login_id) VALUES (?, ?, ?, ?, ?, ?)',
      [login_id, result.lastID, name, email, userRole, login_id]
    );

    res.status(201).json({ message: 'User created successfully', login_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
