import { DataTypes } from 'sequelize';
export const question = (sequelize) => {
  return sequelize.define('questions', {
  
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
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
    tableName: 'questions', 
    timestamps: false,  
  });
};
export default question

