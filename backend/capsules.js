import express from 'express';
const router = express.Router();
import db from '../db/index.js'; 
import { protect } from '../middleware/auth.js'; 
import { broadcast } from '../../WebSocket/backend/utils/broadcast.js'; // Integration with WebSocket module

/**
 * @route   POST /api/v1/capsules
 * @desc    Seal a new time capsule
 */
router.post('/', protect, async (req, res) => {
    const { title, body, image_url, unlock_date, is_public } = req.body;
    
    try {
        const result = await db.query(
            `INSERT INTO capsules (author_id, title, body, image_url, unlock_date, is_public, is_revealed) 
             VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *`,
            [req.user.id, title, body, image_url, unlock_date, is_public !== false]
        );
        
        // WebSocket Broadcast integration
        if (typeof broadcast === 'function') {
            broadcast('live_event', {
                type: 'capsule',
                message: `◈ TIMELINE ANOMALY: ${req.user.name || 'An entity'} sealed a new Time Capsule`,
                time: new Date()
            });
        }

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("CAPSULE SEAL ERROR:", err.message);
        res.status(500).json({ success: false, error: "Error sealing capsule" });
    }
});

/**
 * @route   GET /api/v1/capsules
 * @desc    Get all public capsules
 */
router.get('/', protect, async (req, res) => {
    try {
        await db.query('UPDATE capsules SET is_revealed = true WHERE is_revealed = false AND unlock_date <= NOW()');
        const result = await db.query(`
            SELECT c.*, u.name as author_name 
            FROM capsules c 
            JOIN users u ON c.author_id = u.id 
            WHERE c.is_public = true 
            ORDER BY c.unlock_date DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching capsules" });
    }
});

export default router;
