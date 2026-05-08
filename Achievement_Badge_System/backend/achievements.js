import express from 'express';
const router = express.Router();
import db from '../db/index.js'; // Assuming shared db client
import { protect } from '../middleware/auth.js'; 

/**
 * Achievement & Badge System
 * Tracks user progress and awards digital badges for community engagement.
 */

const BADGES = [
    { key: 'PORTAL_PIONEER', name: 'Portal Pioneer', desc: 'Opened your first Opportunity Portal (Job).' },
    { key: 'NEXUS_NODE', name: 'Nexus Node', desc: 'Established 5 successful connections.' },
    { key: 'TIMELINE_ANCHOR', name: 'Timeline Anchor', desc: 'Completed your profile to 100%.' },
    { key: 'CAPSULE_KEEPER', name: 'Capsule Keeper', desc: 'Sealed your first Time Capsule.' },
    { key: 'SIGNAL_MASTER', name: 'Signal Master', desc: 'Sent 10 mentorship requests.' }
];

// Get user's earned badges
router.get('/me', protect, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM achievements WHERE user_id = $1', [req.user.id]);
        res.json({ success: true, data: result.rows, available_badges: BADGES });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching achievements" });
    }
});

// Leaderboard: Top badge earners
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.name, u.role, COUNT(a.id) as badge_count
            FROM users u
            JOIN achievements a ON u.id = a.user_id
            GROUP BY u.id, u.name, u.role
            ORDER BY badge_count DESC LIMIT 10
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching leaderboard" });
    }
});

/**
 * Internal Utility: Award a badge to a user
 */
export const awardBadge = async (userId, badgeKey) => {
    const badgeDef = BADGES.find(b => b.key === badgeKey);
    if (!badgeDef) return;

    try {
        const check = await db.query('SELECT * FROM achievements WHERE user_id = $1 AND badge_key = $2', [userId, badgeKey]);
        if (check.rows.length === 0) {
            await db.query(
                `INSERT INTO achievements (user_id, badge_key, badge_name, badge_desc) VALUES ($1, $2, $3, $4)`,
                [userId, badgeKey, badgeDef.name, badgeDef.desc]
            );
        }
    } catch (err) { console.error("Badge Award Failure:", err); }
};

export default router;
