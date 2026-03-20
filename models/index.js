import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

import User from './user.js';
import ExerciseLibrary from './exercise_library.js';
import WorkoutSession from './workout_session.js';
import WorkoutExerciseLog from './workout_exercise_log.js';
import StrengthWorkoutSession from './strength_workout_session.js';
import CardioWorkoutSession from './cardio_workout_session.js';
import UserActivity from './user_activity.js';

const UserModel = User(sequelize, DataTypes);
const ExerciseLibraryModel = ExerciseLibrary(sequelize, DataTypes);
const WorkoutSessionModel = WorkoutSession(sequelize, DataTypes);
const WorkoutExerciseLogModel = WorkoutExerciseLog(sequelize, DataTypes);
const StrengthWorkoutSessionModel = StrengthWorkoutSession(sequelize, DataTypes);
const CardioWorkoutSessionModel = CardioWorkoutSession(sequelize, DataTypes);
const UserActivityModel = UserActivity(sequelize, DataTypes);

UserModel.hasMany(WorkoutSessionModel, { foreignKey: 'user_id' });
WorkoutSessionModel.belongsTo(UserModel, { foreignKey: 'user_id' });

WorkoutSessionModel.hasMany(WorkoutExerciseLogModel, { foreignKey: 'workout_session_id' });
WorkoutExerciseLogModel.belongsTo(WorkoutSessionModel, { foreignKey: 'workout_session_id' });

ExerciseLibraryModel.hasMany(WorkoutExerciseLogModel, { foreignKey: 'exercise_library_id' });
WorkoutExerciseLogModel.belongsTo(ExerciseLibraryModel, { foreignKey: 'exercise_library_id' });

WorkoutExerciseLogModel.hasMany(StrengthWorkoutSessionModel, { foreignKey: 'workout_exercise_log_id' });
StrengthWorkoutSessionModel.belongsTo(WorkoutExerciseLogModel, { foreignKey: 'workout_exercise_log_id' });

WorkoutExerciseLogModel.hasMany(CardioWorkoutSessionModel, { foreignKey: 'workout_exercise_log_id' });
CardioWorkoutSessionModel.belongsTo(WorkoutExerciseLogModel, { foreignKey: 'workout_exercise_log_id' });

UserModel.hasMany(UserActivityModel, { foreignKey: 'user_id' });
UserActivityModel.belongsTo(UserModel, { foreignKey: 'user_id' });

export {
    sequelize,
    UserModel as User,
    ExerciseLibraryModel as ExerciseLibrary,
    WorkoutSessionModel as WorkoutSession,
    WorkoutExerciseLogModel as WorkoutExerciseLog,
    StrengthWorkoutSessionModel as StrengthWorkoutSession,
    CardioWorkoutSessionModel as CardioWorkoutSession,
    UserActivityModel as UserActivity,
};
