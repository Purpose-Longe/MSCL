const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

require('dotenv').config();

router.post(
    '/register',
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, dob, weight, height } = req.body;

        try {
            const exists = await User.findOne({ where: { email } });
            if (exists) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            const password_hash = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password_hash, dob, weight, height });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
            res.status(201).json({ token, user: { id: user.id, email: user.email, dob: user.dob, weight: user.weight, height: user.height } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

router.post(
    '/login',
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').exists().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
            res.json({ token, user: { id: user.id, email: user.email, dob: user.dob, weight: user.weight, height: user.height } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
