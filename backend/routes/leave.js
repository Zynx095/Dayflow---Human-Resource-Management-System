import express from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const leaveRequestSchema = z.object({
  leave_type: z.enum(['PAID', 'SICK', 'UNPAID']),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  reason: z.string().min(1, 'Reason cannot be empty')
}).refine(data => data.start_date <= data.end_date, {
  message: "end_date must be on or after start_date",
  path: ["end_date"]
});

// Employee creates leave
router.post('/', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    if (!employee_id) return res.status(400).json({ error: 'No employee record associated with user.' });

    const parsed = leaveRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
    }

    const { leave_type, start_date, end_date, reason } = parsed.data;
    const db = await getDb();

    const nowStr = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [employee_id, leave_type, start_date, end_date, reason, 'PENDING', nowStr, nowStr]
    );

    res.json({ message: 'Leave request created', id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Employee retrieves own leave
router.get('/my', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    const db = await getDb();
    
    const records = await db.all(
      'SELECT * FROM leave_requests WHERE employee_id = $1 ORDER BY created_at DESC',
      [employee_id]
    );
    
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// HR retrieves all leave
router.get('/all', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();
    
    const records = await db.all(
      'SELECT lr.*, e.name as employee_name FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id ORDER BY lr.created_at DESC'
    );
    
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Both retrieve specific leave
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    
    const record = await db.get('SELECT * FROM leave_requests WHERE id = $1', [id]);
    
    if (!record) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    // Authorization: if employee, must own the record
    if (req.user.role === 'employee' && record.employee_id !== req.user.employee_id) {
      return res.status(403).json({ error: 'Forbidden: Cannot access another employee leave request' });
    }
    
    res.json({ record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// HR Approve
router.post('/:id/approve', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comment } = req.body;
    const db = await getDb();
    
    const record = await db.get('SELECT * FROM leave_requests WHERE id = $1', [id]);
    if (!record) return res.status(404).json({ error: 'Leave request not found' });
    
    if (record.status !== 'PENDING') {
      return res.status(400).json({ error: `Cannot approve request with status ${record.status}` });
    }
    
    const nowStr = new Date().toISOString();
    await db.run(
      'UPDATE leave_requests SET status = $1, admin_comment = $2, updated_at = $3 WHERE id = $4',
      ['APPROVED', admin_comment || null, nowStr, id]
    );
    
    res.json({ message: 'Leave request approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// HR Reject
router.post('/:id/reject', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comment } = req.body;
    const db = await getDb();
    
    const record = await db.get('SELECT * FROM leave_requests WHERE id = $1', [id]);
    if (!record) return res.status(404).json({ error: 'Leave request not found' });
    
    if (record.status !== 'PENDING') {
      return res.status(400).json({ error: `Cannot reject request with status ${record.status}` });
    }
    
    const nowStr = new Date().toISOString();
    await db.run(
      'UPDATE leave_requests SET status = $1, admin_comment = $2, updated_at = $3 WHERE id = $4',
      ['REJECTED', admin_comment || null, nowStr, id]
    );
    
    res.json({ message: 'Leave request rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
