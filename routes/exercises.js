const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ExerciseLibrary } = require('../models');
const authMiddleware = require('../middleware/auth');

// Public: list exercises
router.get('/', async (req, res) => {
    try {
        const exercises = await ExerciseLibrary.findAll();
        res.json({ exercises });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Authenticated: create exercise (custom)
router.post(
    '/',
    authMiddleware,
    body('name').notEmpty().withMessage('Name is required'),
    body('workout_type').isIn(['cardio', 'strength']).withMessage('Workout type must be cardio or strength'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, workout_type, description } = req.body;
            const exercise = await ExerciseLibrary.create({
                name,
                workout_type,
                description,
                is_custom: true,
                created_by: req.user.id,
            });
            res.status(201).json({ exercise });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
