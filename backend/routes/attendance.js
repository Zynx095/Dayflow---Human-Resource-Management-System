import express from 'express';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

router.post('/check-in', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    if (!employee_id) return res.status(400).json({ error: 'No employee record associated with user.' });

    const today = getTodayString();
    const db = await getDb();

    // Check if already checked in today
    const existing = await db.get('SELECT * FROM attendance WHERE employee_id = $1 AND date = $2', [employee_id, today]);
    if (existing) {
      return res.status(400).json({ error: 'Already checked in today.' });
    }

    const now = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO attendance (employee_id, date, check_in, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [employee_id, today, now, 'present']
    );

    res.json({ message: 'Checked in successfully', id: result.lastID, check_in: now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/check-out', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    if (!employee_id) return res.status(400).json({ error: 'No employee record associated with user.' });

    const today = getTodayString();
    const db = await getDb();

    const record = await db.get('SELECT * FROM attendance WHERE employee_id = $1 AND date = $2', [employee_id, today]);
    
    if (!record) {
      return res.status(400).json({ error: 'Cannot check out before checking in today.' });
    }
    if (record.check_out) {
      return res.status(400).json({ error: 'Already checked out today.' });
    }

    const now = new Date();
    const checkInTime = new Date(record.check_in);
    
    // Calculate worked hours safely
    const diffMs = now.getTime() - checkInTime.getTime();
    const workedHours = diffMs / (1000 * 60 * 60);

    const nowStr = now.toISOString();

    await db.run(
      'UPDATE attendance SET check_out = $1, worked_hours = $2, updated_at = $3 WHERE id = $4',
      [nowStr, workedHours, nowStr, record.id]
    );

    res.json({ message: 'Checked out successfully', check_out: nowStr, worked_hours: workedHours });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/today', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    const today = getTodayString();
    const db = await getDb();

    const record = await db.get('SELECT * FROM attendance WHERE employee_id = $1 AND date = $2', [employee_id, today]);
    res.json({ record: record || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/weekly', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    const db = await getDb();
    
    // Last 7 records (or based on date string if strictly last 7 days)
    const records = await db.all(
      'SELECT * FROM attendance WHERE employee_id = $1 ORDER BY date DESC LIMIT 7',
      [employee_id]
    );
    
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
