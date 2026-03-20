export default (sequelize, DataTypes) => {
    return sequelize.define('StrengthWorkoutSession', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        workout_exercise_log_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        set: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rep: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'kg',
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rest_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Rest time in seconds per set',
        },
    }, {
        tableName: 'strength_workout_sessions',
        underscored: true,
        timestamps: true,
    });
};