import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming shared db client
import { protect } from '../middleware/auth.js'; 
import { broadcast, broadcastToRoom } from '../../WebSocket/backend/broadcast.js'; // Integration hook

/**
 * Messaging Module Backend
 * Handles private conversations, message history, and real-time chat signals.
 */

// Get all conversations
router.get('/conversations', protect, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, 
            CASE WHEN c.user1_id = $1 THEN u2.name ELSE u1.name END as participant_name
            FROM conversations c
            JOIN users u1 ON c.user1_id = u1.id
            JOIN users u2 ON c.user2_id = u2.id
            WHERE c.user1_id = $1 OR c.user2_id = $1
            ORDER BY c.updated_at DESC
        `, [req.user.id]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Fetch failed" });
    }
});

// Send a message
router.post('/', protect, async (req, res) => {
    const { receiver_id, body } = req.body;
    try {
        // Find/Create conversation logic
        const u1 = Math.min(req.user.id, receiver_id);
        const u2 = Math.max(req.user.id, receiver_id);
        
        await db.query('INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [u1, u2]);
        const conv = await db.query('SELECT id FROM conversations WHERE user1_id = $1 AND user2_id = $2', [u1, u2]);
        const conversationId = conv.rows[0].id;

        const msg = await db.query(
            'INSERT INTO messages (conversation_id, sender_id, receiver_id, body) VALUES ($1, $2, $3, $4) RETURNING *',
            [conversationId, req.user.id, receiver_id, body]
        );

        broadcastToRoom(`chat_${conversationId}`, 'chat_msg', msg.rows[0]);
        res.status(201).json({ success: true, data: msg.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Transmission failed" });
    }
});

export default router;
