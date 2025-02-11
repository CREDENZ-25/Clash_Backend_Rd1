import { DataTypes } from 'sequelize';
export const question = (sequelize) => {
  return sequelize.define('MCQs', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[0, 1, 2, 3]] // Sequelize's validation for allowed values
      }
    },
    isJunior: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'MCQs', 
    timestamps: false,  
  });
};
export default question