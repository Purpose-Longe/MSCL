export default (sequelize, DataTypes) => {
    return sequelize.define('CardioWorkoutSession', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        workout_exercise_log_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in seconds',
        },
        distance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        calories: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        pace: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'cardio_workout_sessions',
        underscored: true,
        timestamps: true,
    });
};