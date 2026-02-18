const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validateLogin } = require('../middleware/validation');

// Login
router.post('/login', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.' });

    // Block logic for officials not approved
    if (user.status === 'PENDING') {
        return res.status(403).json({ message: 'Account pending judicial verification.' });
    }
    if (user.status === 'BLOCKED') {
        return res.status(403).json({ message: 'Account has been restricted.' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET || 'supersecretkey_change_me',
        { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already registered.' });

        const passwordHash = await bcrypt.hash(password, 10);

        // Officials start as PENDING
        const status = (role === 'litigant') ? 'APPROVED' : 'PENDING';

        const user = await User.create({
            name,
            email,
            password: passwordHash,
            role,
            status
        });

        res.json({
            message: status === 'PENDING' ? 'Registration success. Awaiting admin approval.' : 'Registration successful.',
            status: user.status
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed.' });
    }
});

// Admin: List Pending Users
router.get('/admin/pending', async (req, res) => {
    // In a real app, middleware would check if req.user.role === 'admin'
    const users = await User.findAll({ where: { status: 'PENDING' } });
    res.json(users);
});

// Admin: Toggle Status
router.post('/admin/verify', async (req, res) => {
    const { userId, status } = req.body;
    await User.update({ status }, { where: { id: userId } });
    res.json({ message: `User status updated to ${status}` });
});

module.exports = router;
