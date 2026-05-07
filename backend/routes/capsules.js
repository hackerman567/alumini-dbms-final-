import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming db client is available
import { protect } from '../middleware/auth.js'; // Assuming auth middleware is available
import { broadcast } from '../utils/broadcast.js';

/**
 * @route   POST /api/v1/capsules
 * @desc    Seal a new time capsule and broadcast the event
 */
router.post('/', protect, async (req, res) => {
    const { title, body, image_url, unlock_date, is_public } = req.body;
    
    try {
        const result = await db.query(
            `INSERT INTO capsules (author_id, title, body, image_url, unlock_date, is_public, is_revealed) 
             VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *`,
            [req.user.id, title, body, image_url, unlock_date, is_public !== false]
        );
        
        // WebSocket Broadcast to the Ticker Feed
        broadcast('live_event', {
            type: 'capsule',
            message: `◈ TIMELINE ANOMALY: ${req.user.name || 'An entity'} sealed a new Time Capsule`,
            time: new Date()
        });

        // Award CAPSULE_KEEPER badge logic
        const badgeCheck = await db.query('SELECT * FROM achievements WHERE user_id = $1 AND badge_key = $2', [req.user.id, 'CAPSULE_KEEPER']);
        if (badgeCheck.rows.length === 0) {
            await db.query(
                `INSERT INTO achievements (user_id, badge_key, badge_name, badge_desc) 
                 VALUES ($1, $2, $3, $4)`,
                [req.user.id, 'CAPSULE_KEEPER', 'Capsule Keeper', 'Sealed your first Time Capsule.']
            );
        }

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("CAPSULE SEAL ERROR:", err.message);
        res.status(500).json({ success: false, error: "Error sealing capsule" });
    }
});

/**
 * @route   GET /api/v1/capsules
 * @desc    Get all public capsules (auto-reveals based on date)
 */
router.get('/', protect, async (req, res) => {
    try {
        // Auto-reveal logic
        await db.query('UPDATE capsules SET is_revealed = true WHERE is_revealed = false AND unlock_date <= NOW()');

        const result = await db.query(`
            SELECT c.id, c.author_id, c.title, c.unlock_date, c.is_revealed, c.created_at,
            CASE WHEN c.is_revealed = true THEN c.body ELSE '[LOCKED_SIGNAL]' END as body,
            u.name as author_name, u.avatar_url as author_avatar
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
