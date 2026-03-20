const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { UserActivity } = require('../models');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const activities = await UserActivity.findAll({ where: { user_id: req.user.id }, order: [['time_created', 'DESC']] });
        res.json({ activities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post(
    '/',
    body('description').notEmpty().withMessage('description is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const activity = await UserActivity.create({
                user_id: req.user.id,
                description: req.body.description,
                category: req.body.category,
            });
            res.status(201).json({ activity });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
