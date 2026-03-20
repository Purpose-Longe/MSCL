export default (sequelize, DataTypes) => {
    return sequelize.define('ExerciseLibrary', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        workout_type: {
            type: DataTypes.ENUM('cardio', 'strength'),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_custom: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'exercise_library',
        underscored: true,
        timestamps: true,
    });
};