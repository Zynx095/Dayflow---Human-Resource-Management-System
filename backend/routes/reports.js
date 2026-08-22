import express from 'express';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Attendance Report (HR only)
router.get('/attendance', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();

    // Fetch aggregated data or all raw records
    const records = await db.all(
      `SELECT a.id, a.date, a.check_in, a.check_out, a.status, a.worked_hours, a.payment_status,
              e.name as employee_name, e.employee_id
       FROM attendance a
       JOIN employees e ON a.employee_id = e.id
       ORDER BY a.date DESC`
    );

    // Basic aggregation
    const totalPresent = records.filter(r => r.status === 'present').length;
    const totalAbsent = records.filter(r => r.status === 'absent').length;

    res.json({ records, totalPresent, totalAbsent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave Report (HR only)
router.get('/leave', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();

    const records = await db.all(
      `SELECT l.id, l.leave_type, l.start_date, l.end_date, l.reason, l.status, l.admin_comment,
              e.name as employee_name, e.employee_id
       FROM leave_requests l
       JOIN employees e ON l.employee_id = e.id
       ORDER BY l.created_at DESC`
    );

    const pending = records.filter(r => r.status === 'PENDING').length;
    const approved = records.filter(r => r.status === 'APPROVED').length;
    const rejected = records.filter(r => r.status === 'REJECTED').length;

    res.json({ records, pending, approved, rejected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payroll Report (HR only)
router.get('/payroll', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();

    const records = await db.all(
      `SELECT p.id, p.pay_period, p.base_salary, p.allowances, p.deductions, p.net_salary,
              e.name as employee_name, e.employee_id, e.department, e.designation
       FROM payroll p
       JOIN employees e ON p.employee_id = e.id
       ORDER BY p.pay_period DESC, e.name ASC`
    );

    // Total payroll
    const totalPayroll = records.reduce((sum, r) => sum + Number(r.net_salary), 0);

    res.json({ records, totalPayroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
