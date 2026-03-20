import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import { ExerciseLibrary } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         workout_type:
 *           type: string
 *           enum: [cardio, strength]
 *         description:
 *           type: string
 *         is_custom:
 *           type: boolean
 *         created_by:
 *           type: integer
 *     CreateExerciseRequest:
 *       type: object
 *       required:
 *         - name
 *         - workout_type
 *       properties:
 *         name:
 *           type: string
 *         workout_type:
 *           type: string
 *           enum: [cardio, strength]
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exercises:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *   post:
 *     summary: Create a custom exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExerciseRequest'
 *     responses:
 *       201:
 *         description: Exercise created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exercise:
 *                   $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Unauthorized
 */
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

export default router;
