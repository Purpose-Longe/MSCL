const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, DataTypes);
const ExerciseLibrary = require('./exercise_library')(sequelize, DataTypes);
const WorkoutSession = require('./workout_session')(sequelize, DataTypes);
const WorkoutExerciseLog = require('./workout_exercise_log')(sequelize, DataTypes);
const StrengthWorkoutSession = require('./strength_workout_session')(sequelize, DataTypes);
const CardioWorkoutSession = require('./cardio_workout_session')(sequelize, DataTypes);
const UserActivity = require('./user_activity')(sequelize, DataTypes);

User.hasMany(WorkoutSession, { foreignKey: 'user_id' });
WorkoutSession.belongsTo(User, { foreignKey: 'user_id' });

WorkoutSession.hasMany(WorkoutExerciseLog, { foreignKey: 'workout_session_id' });
WorkoutExerciseLog.belongsTo(WorkoutSession, { foreignKey: 'workout_session_id' });

ExerciseLibrary.hasMany(WorkoutExerciseLog, { foreignKey: 'exercise_library_id' });
WorkoutExerciseLog.belongsTo(ExerciseLibrary, { foreignKey: 'exercise_library_id' });

WorkoutExerciseLog.hasMany(StrengthWorkoutSession, { foreignKey: 'workout_exercise_log_id' });
StrengthWorkoutSession.belongsTo(WorkoutExerciseLog, { foreignKey: 'workout_exercise_log_id' });

WorkoutExerciseLog.hasMany(CardioWorkoutSession, { foreignKey: 'workout_exercise_log_id' });
CardioWorkoutSession.belongsTo(WorkoutExerciseLog, { foreignKey: 'workout_exercise_log_id' });

User.hasMany(UserActivity, { foreignKey: 'user_id' });
UserActivity.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    ExerciseLibrary,
    WorkoutSession,
    WorkoutExerciseLog,
    StrengthWorkoutSession,
    CardioWorkoutSession,
    UserActivity,
};
