import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hackathon_key_do_not_commit_in_real_life';

// --- Validation Schemas ---

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

// --- Helper: Generate Login ID ---
// Format: OI[NameInitials][Year][4-digit serial]
// Example: OIJD20260001

async function generateLoginId(db, firstName, lastName) {
  const companyInitials = 'OI';
  const nameInitials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  const year = new Date().getFullYear();

  const countRow = await db.get(
    `SELECT COUNT(*) as count FROM users WHERE EXTRACT(YEAR FROM created_at) = $1`,
    [year]
  );
  const serial = (parseInt(countRow.count) + 1).toString().padStart(4, '0');

  return `${companyInitials}${nameInitials}${year}${serial}`;
}

// --- Helper: Generate Employee ID ---
// Format: EMP-[3-digit serial]

async function generateEmployeeId(db) {
  const countRow = await db.get('SELECT COUNT(*) as count FROM employees');
  const serial = (parseInt(countRow.count)).toString().padStart(3, '0');
  return `EMP-${serial}`;
}

// --- Routes ---

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
    }

    const { email, password } = parsed.data;
    const db = await getDb();

    const user = await db.get('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get employee details if they exist
    const employee = await db.get(
      'SELECT id as employee_id, name FROM employees WHERE user_id = $1',
      [user.id]
    );

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        employee_id: employee ? employee.employee_id : null,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: employee?.name || null,
      },
    });
  } catch (err) {
    console.error('POST /signin error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signout
router.post('/signout', authenticateToken, (req, res) => {
  // JWT-based auth: signout is a client-side action (deleting the token).
  res.json({ message: 'Signed out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, email, role FROM users WHERE id = $1', [req.user.id]);
    const employee = await db.get('SELECT * FROM employees WHERE user_id = $1', [req.user.id]);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user, employee });
  } catch (err) {
    console.error('GET /me error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
    }

    const { email, password, firstName, lastName } = parsed.data;
    const db = await getDb();

    // Check for existing user
    const existing = await db.get('SELECT id FROM users WHERE email = $1', [email]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const login_id = await generateLoginId(db, firstName, lastName);
    const userRole = 'employee'; // HR accounts can only be seeded/created by admins

    // Insert user — login_id is stored on the users table
    const result = await db.run(
      'INSERT INTO users (email, password_hash, role, login_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, password_hash, userRole, login_id]
    );

    // Insert employee record — NO login_id column here (it doesn't exist on this table)
    const employee_id = await generateEmployeeId(db);
    const name = `${firstName} ${lastName}`;
    await db.run(
      'INSERT INTO employees (employee_id, user_id, name, email, department, role) VALUES ($1, $2, $3, $4, $5, $6)',
      [employee_id, result.lastID, name, email, 'Unassigned', userRole]
    );

    res.status(201).json({ message: 'Account created successfully', login_id });
  } catch (err) {
    console.error('POST /signup error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
