import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming shared db client
import { protect } from '../middleware/auth.js'; 
import { authorize } from '../middleware/rbac.js';
import { broadcast } from '../../WebSocket/backend/broadcast.js'; // Integration hook

/**
 * Job Board Module Backend
 * Manages career opportunities, applications, and real-time portal signals.
 */

// Fetch all active job portals
router.get('/', protect, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM job_postings WHERE status = $1 ORDER BY created_at DESC', ['open']);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching jobs" });
    }
});

// Post a new opportunity (Alumni/Admin only)
router.post('/', protect, authorize('alumni', 'admin'), async (req, res) => {
    const { title, company, description, requirements, type, location, is_remote, salary_range, deadline } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO job_postings (posted_by, title, company, description, requirements, type, location, is_remote, salary_range, deadline) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [req.user.id, title, company, description, requirements, type, location, is_remote, salary_range, deadline]
        );
        
        broadcast('live_event', {
            type: 'job',
            message: `◈ NEW PORTAL DETECTED: ${req.user.name} opened a gateway to ${company}`,
            time: new Date()
        });

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error posting job" });
    }
});

// Apply for a job (Student only)
router.post('/:id/apply', protect, authorize('student'), async (req, res) => {
    try {
        await db.query(
            'INSERT INTO job_applications (job_id, applicant_id) VALUES ($1, $2)',
            [req.params.id, req.user.id]
        );
        res.json({ success: true, message: "Application transmitted" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Application failed" });
    }
});

export default router;
