import { ExerciseLibrary, sequelize } from '../models';

const exercises = [
    { name: 'Bench Press', workout_type: 'strength', description: 'Barbell chest press.' },
    { name: 'Squat', workout_type: 'strength', description: 'Barbell lower body squat.' },
    { name: 'Deadlift', workout_type: 'strength', description: 'Barbell deadlift.' },
    { name: 'Running', workout_type: 'cardio', description: 'Treadmill or outdoor run.' },
    { name: 'Cycling', workout_type: 'cardio', description: 'Stationary or road cycling.' },
];

(async () => {
    try {
        await sequelize.sync({ alter: true });
        for (const e of exercises) {
            await ExerciseLibrary.findOrCreate({ where: { name: e.name }, defaults: e });
        }
        console.log('Seeded exercise library');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
