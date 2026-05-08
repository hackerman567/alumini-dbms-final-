import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming shared db client
import { protect } from '../middleware/auth.js'; 
import { authorize } from '../middleware/rbac.js';

/**
 * Admin Console Backend
 * Handles user management, verification, and audit logging.
 */

router.use(protect);
router.use(authorize('admin'));

// Get all system users
router.get('/users', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, role, is_active, created_at, last_login FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching users" });
    }
});

// Update user verification/suspension status
router.put('/users/:id/status', async (req, res) => {
    const { is_active } = req.body;
    try {
        await db.query('UPDATE users SET is_active = $1 WHERE id = $2', [is_active, req.params.id]);
        
        // Internal Audit Log
        await db.query(
            'INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, is_active ? 'VERIFY' : 'SUSPEND', 'USER', req.params.id, `Status set to ${is_active}`]
        );

        res.json({ success: true, message: "Operation successful" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Database update failed" });
    }
});

export default router;
