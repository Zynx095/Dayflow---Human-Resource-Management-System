import express from 'express';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/hr', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];

    const [workforceRes, attendanceRes, leaveRes] = await Promise.all([
      db.get("SELECT COUNT(*) as count FROM users WHERE role = 'employee'"),
      db.get("SELECT COUNT(*) as count FROM attendance WHERE date = $1 AND status = 'present'", [today]),
      db.get("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'PENDING'")
    ]);

    res.json({
      totalWorkforce: parseInt(workforceRes.count) || 0,
      todayAttendance: parseInt(attendanceRes.count) || 0,
      pendingLeaves: parseInt(leaveRes.count) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
