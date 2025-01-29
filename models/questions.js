import { STRING, INTEGER, BOOLEAN, Model, DataTypes } from 'sequelize';

class MCQ extends Model {}

const initMCQmodel = (sequelize) => {
    MCQ.init(
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            question: {
                type: STRING,  // Renamed from "questions" to "question" for clarity
                allowNull: false,
            },
            options: {
                type: DataTypes.ARRAY(DataTypes.STRING), // Now an array of strings
                allowNull: false,
            },
            correct: {
                type: INTEGER, // Stores the correct option index
                allowNull: false,
                validate: {
                    min: 0, // Ensures the index is at least 0
                    max: 3, // Ensures the index is within valid range
                },
            },
            isJunior: {
                type: BOOLEAN,
                defaultValue: false, // Default to false
            },
        },
        { sequelize }
    );

    return MCQ.sync()
        .then(() => console.log("MCQ table created!"))
        .catch((err) => console.log("Table not created:", err));
};

export { MCQ, initMCQmodel };
