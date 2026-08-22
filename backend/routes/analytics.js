import express from 'express';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/hr', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];

    const [workforceRes, attendanceRes, leaveRes, payrollRes] = await Promise.all([
      db.get("SELECT COUNT(*) as count FROM users WHERE role = 'employee'"),
      db.get("SELECT COUNT(*) as count FROM attendance WHERE date = $1 AND status = 'present'", [today]),
      db.get("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'PENDING'"),
      db.get("SELECT SUM(net_salary) as total FROM payroll")
    ]);

    const totalWorkforce = parseInt(workforceRes.count) || 0;
    const todayAttendance = parseInt(attendanceRes.count) || 0;
    const attendanceRate = totalWorkforce > 0 ? Math.round((todayAttendance / totalWorkforce) * 100) : 0;

    res.json({
      totalWorkforce,
      todayAttendance,
      attendanceRate,
      pendingLeaves: parseInt(leaveRes.count) || 0,
      totalPayroll: parseFloat(payrollRes.total) || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
