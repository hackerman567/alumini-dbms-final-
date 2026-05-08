import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming shared db client
import { protect } from '../middleware/auth.js'; 

/**
 * Nexus Dashboard Backend
 * Handles historical events and global ticker data for the dashboard.
 */

// Get historical anniversary events
router.get('/history', protect, async (req, res) => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const result = await db.query(`
            SELECT name, role, created_at, EXTRACT(YEAR FROM created_at) as year
            FROM users 
            WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(DAY FROM created_at) = $2
            AND EXTRACT(YEAR FROM created_at) < EXTRACT(YEAR FROM CURRENT_TIMESTAMP)
            LIMIT 5
        `, [month, day]);
        
        const events = result.rows.map(row => ({
            type: 'anniversary',
            title: `${row.name} joined the Nexus`,
            desc: `On this day in ${row.year}, a new ${row.role} entity was synthesized.`,
            year: row.year
        }));

        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, error: "Temporal sync failed" });
    }
});

// Get recent system-wide activity for ticker
router.get('/ticker', protect, async (req, res) => {
    try {
        const jobs = await db.query('SELECT title FROM job_postings ORDER BY created_at DESC LIMIT 3');
        const users = await db.query('SELECT name FROM users ORDER BY created_at DESC LIMIT 3');
        
        const tickerData = [
            ...jobs.rows.map(j => `NEW PORTAL: ${j.title}`),
            ...users.rows.map(u => `ENTITY DETECTED: ${u.name}`),
            "NEXUS STATUS: NOMINAL"
        ];
        res.json({ success: true, data: tickerData });
    } catch (err) {
        res.status(500).json({ success: false, error: "Ticker feed failure" });
    }
});

export default router;
