const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { UserActivity } = require('../models');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         time_created:
 *           type: string
 *           format: date-time
 *     CreateActivityRequest:
 *       type: object
 *       required:
 *         - description
 *       properties:
 *         description:
 *           type: string
 *         category:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/activities:
 *   get:
 *     summary: Get user's activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of activities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Activity'
 *   post:
 *     summary: Create a new activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       201:
 *         description: Activity created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activity:
 *                   $ref: '#/components/schemas/Activity'
 */

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
