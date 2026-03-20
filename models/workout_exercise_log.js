module.exports = (sequelize, DataTypes) => {
    return sequelize.define('WorkoutExerciseLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        workout_session_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exercise_library_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rest_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Rest time in seconds (optionally per exercise)',
        },
    }, {
        tableName: 'workout_exercise_log',
        underscored: true,
        timestamps: true,
    });
};