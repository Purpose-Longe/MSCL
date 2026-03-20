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

/**
 * @swagger
 * components:
 *   schemas:
 *     StrengthSet:
 *       type: object
 *       properties:
 *         set:
 *           type: integer
 *         rep:
 *           type: integer
 *         weight:
 *           type: number
 *         unit:
 *           type: string
 *         type:
 *           type: string
 *         rest_time:
 *           type: integer
 *     CardioSet:
 *       type: object
 *       properties:
 *         duration:
 *           type: integer
 *         distance:
 *           type: number
 *         calories:
 *           type: number
 *         pace:
 *           type: string
 *     WorkoutExercise:
 *       type: object
 *       properties:
 *         exercise_library_id:
 *           type: integer
 *         order:
 *           type: integer
 *         rest_time:
 *           type: integer
 *         strength_sets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StrengthSet'
 *         cardio_sets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardioSet'
 *     CreateWorkoutRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         started_at:
 *           type: string
 *           format: date-time
 *         ended_at:
 *           type: string
 *           format: date-time
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkoutExercise'
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         started_at:
 *           type: string
 *           format: date-time
 *         ended_at:
 *           type: string
 *           format: date-time
 *         workout_exercise_logs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               exercise_library:
 *                 $ref: '#/components/schemas/Exercise'
 *               strength_workout_sessions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/StrengthSet'
 *               cardio_workout_sessions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CardioSet'
 */

/**
 * @swagger
 * /api/v1/workouts:
 *   get:
 *     summary: Get user's workouts
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workouts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workout'
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *     responses:
 *       201:
 *         description: Workout created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workout:
 *                   $ref: '#/components/schemas/Workout'
 */

/**
 * @swagger
 * /api/v1/workouts/{id}:
 *   get:
 *     summary: Get workout by ID
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workout details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workout:
 *                   $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *   put:
 *     summary: Update workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               started_at:
 *                 type: string
 *                 format: date-time
 *               ended_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Workout updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workout:
 *                   $ref: '#/components/schemas/Workout'
 *   delete:
 *     summary: Delete workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workout deleted
 */

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
