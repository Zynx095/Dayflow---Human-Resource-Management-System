import express from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// --- Validation Schemas ---

const hrUpdateSchema = z.object({
  department: z.string().min(1).optional(),
  designation: z.string().min(1).optional(),
  salary: z.number().nonnegative().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const employeeUpdateSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
});

// --- Routes ---

// GET /api/employees (HR only)
router.get('/', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();
    
    // Join with users to get email and role, but DO NOT select password_hash
    const result = await db.all(`
      SELECT 
        e.id, e.employee_id, e.name, e.department, e.designation, e.salary, e.phone, e.address,
        u.email, u.role
      FROM employees e
      JOIN users u ON e.user_id = u.id
      ORDER BY e.name ASC
    `);
    
    res.json({ employees: result });
  } catch (err) {
    console.error('GET /api/employees error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/employees/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const db = await getDb();

    // Check authorization: Must be HR, or the employee themselves
    if (req.user.role !== 'hr') {
      const myProfile = await db.get('SELECT id FROM employees WHERE user_id = $1', [req.user.id]);
      if (!myProfile || myProfile.id !== targetId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own profile' });
      }
    }

    const employee = await db.get(`
      SELECT 
        e.id, e.employee_id, e.name, e.department, e.designation, e.salary, e.phone, e.address,
        u.email, u.role, u.login_id
      FROM employees e
      JOIN users u ON e.user_id = u.id
      WHERE e.id = $1
    `, [targetId]);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ employee });
  } catch (err) {
    console.error('GET /api/employees/:id error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/employees/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const db = await getDb();
    
    // Verify target exists
    const targetEmployee = await db.get('SELECT * FROM employees WHERE id = $1', [targetId]);
    if (!targetEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    let parsed;
    let allowedFields = [];

    // Authorization & Validation
    if (req.user.role === 'hr') {
      parsed = hrUpdateSchema.safeParse(req.body);
      allowedFields = ['department', 'designation', 'salary', 'phone', 'address'];
    } else {
      // Must be the employee themselves
      if (targetEmployee.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You can only edit your own profile' });
      }
      
      // Check if they tried to update protected fields
      if (req.body.salary !== undefined || req.body.department !== undefined || req.body.designation !== undefined) {
        return res.status(403).json({ error: 'Forbidden: You cannot modify organizational fields' });
      }
      
      parsed = employeeUpdateSchema.safeParse(req.body);
      allowedFields = ['phone', 'address'];
    }

    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
    }

    const updateData = parsed.data;
    
    // Build dynamic update query based on allowed fields provided
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(updateData[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return res.json({ message: 'No changes provided', employee: targetEmployee });
    }

    values.push(targetId);
    
    const query = `
      UPDATE employees 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const updatedEmployee = await db.get(query, values);
    
    res.json({ message: 'Profile updated successfully', employee: updatedEmployee });
  } catch (err) {
    console.error('PUT /api/employees/:id error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
