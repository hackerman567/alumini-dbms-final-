import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming shared db client
import { protect } from '../middleware/auth.js'; 

/**
 * Notifications Module Backend
 * Tracks system alerts, mentorship requests, and career updates.
 */

// Get all user notifications
router.get('/', protect, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching notifications" });
    }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        res.json({ success: true, message: "Signal acknowledged" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Database update failed" });
    }
});

export default router;
