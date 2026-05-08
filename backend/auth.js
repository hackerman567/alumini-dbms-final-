import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js'; // Assuming shared db client

/**
 * Authentication Backend
 * Handles secure registration, login, and token generation.
 */

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password, role, department, graduation_year, enrollment_year } = req.body;
    try {
        const salt = await bcrypt.genSalt(12);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, role',
            [name, email, password_hash, role || 'student']
        );
        
        const userId = newUser.rows[0].id;
        
        // Role-based profile initialization
        if (role === 'alumni') {
            await db.query('INSERT INTO alumni_profiles (user_id, graduation_year, department) VALUES ($1, $2, $3)', [userId, graduation_year, department]);
        } else {
            await db.query('INSERT INTO student_profiles (user_id, enrollment_year, department) VALUES ($1, $2, $3)', [userId, enrollment_year, department]);
        }

        const token = jwt.sign({ id: userId, role: newUser.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: "Registration failed" });
    }
});

// Login existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userRes.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ success: false, error: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

export default router;
