import express from 'express';
import { getDb } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user.userId;

    const notifications = await db.all(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark single notification as read
router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const userId = req.user.userId;

    await db.run(
      `UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all as read
router.post('/read-all', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user.userId;

    await db.run(
      `UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE`,
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
