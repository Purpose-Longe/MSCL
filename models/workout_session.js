export default (sequelize, DataTypes) => {
    return sequelize.define('WorkoutSession', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        ended_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'workouts_sessions',
        underscored: true,
        timestamps: true,
    });
};