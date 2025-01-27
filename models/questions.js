import { DataTypes } from 'sequelize';
export const question = (sequelize) => {
  return sequelize.define('questions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    optionArray: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false, 
    },
    answerIdx: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isJunior: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

