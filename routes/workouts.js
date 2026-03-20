const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');
const {
    WorkoutSession,
    WorkoutExerciseLog,
    StrengthWorkoutSession,
    CardioWorkoutSession,
    ExerciseLibrary,
} = require('../models');

const includeWorkoutData = [
    {
        model: WorkoutExerciseLog,
        include: [ExerciseLibrary, StrengthWorkoutSession, CardioWorkoutSession],
    },
];

router.use(authMiddleware);

router.post(
    '/',
    body('name').notEmpty().withMessage('name is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, type, started_at, ended_at, exercises } = req.body;

        try {
            const workout = await WorkoutSession.create({
                user_id: req.user.id,
                name,
                type,
                started_at,
                ended_at,
            });

            if (Array.isArray(exercises)) {
                for (const [index, item] of exercises.entries()) {
                    const workoutExercise = await WorkoutExerciseLog.create({
                        workout_session_id: workout.id,
                        exercise_library_id: item.exercise_library_id,
                        order: item.order ?? index + 1,
                        rest_time: item.rest_time,
                    });

                    if (item.strength_sets && Array.isArray(item.strength_sets)) {
                        for (const setData of item.strength_sets) {
                            await StrengthWorkoutSession.create({
                                workout_exercise_log_id: workoutExercise.id,
                                set: setData.set,
                                rep: setData.rep,
                                weight: setData.weight,
                                unit: setData.unit || 'kg',
                                type: setData.type,
                                rest_time: setData.rest_time,
                            });
                        }
                    }

                    if (item.cardio_sets && Array.isArray(item.cardio_sets)) {
                        for (const cardioData of item.cardio_sets) {
                            await CardioWorkoutSession.create({
                                workout_exercise_log_id: workoutExercise.id,
                                duration: cardioData.duration,
                                distance: cardioData.distance,
                                calories: cardioData.calories,
                                pace: cardioData.pace,
                            });
                        }
                    }
                }
            }

            const result = await WorkoutSession.findByPk(workout.id, { include: includeWorkoutData });
            res.status(201).json({ workout: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

router.get('/', async (req, res) => {
    const { startDate, endDate } = req.query;
    const where = { user_id: req.user.id };
    if (startDate || endDate) {
        where.started_at = {};
        if (startDate) where.started_at[Op.gte] = new Date(startDate);
        if (endDate) where.started_at[Op.lte] = new Date(endDate);
    }

    try {
        const workouts = await WorkoutSession.findAll({ where, include: includeWorkoutData, order: [['started_at', 'DESC']] });
        res.json({ workouts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const workout = await WorkoutSession.findOne({ where: { id, user_id: req.user.id }, include: includeWorkoutData });
        if (!workout) {
            return res.status(404).json({ message: 'Workout session not found' });
        }
        res.json({ workout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, started_at, ended_at } = req.body;

    try {
        const workout = await WorkoutSession.findOne({ where: { id, user_id: req.user.id } });
        if (!workout) {
            return res.status(404).json({ message: 'Workout session not found' });
        }

        await workout.update({ name, type, started_at, ended_at });
        const updated = await WorkoutSession.findByPk(workout.id, { include: includeWorkoutData });
        res.json({ workout: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const workout = await WorkoutSession.findOne({ where: { id, user_id: req.user.id } });
        if (!workout) {
            return res.status(404).json({ message: 'Workout session not found' });
        }

        await workout.destroy();
        res.json({ message: 'Workout session deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
