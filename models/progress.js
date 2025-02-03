import { DataTypes } from "sequelize";
import { UserModel } from '../config/db.js';
const Progress = (sequelize) => {
  const ProgressModel = sequelize.define("Progress", {
    Questionsid: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    Selectedans: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    Correctans: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    Marks: {
      type: DataTypes.INTEGER,
    },
    Counter: {
      type: DataTypes.INTEGER,
    },
    isJunior: {
      type: DataTypes.BOOLEAN,
    },
    userid: {  // Add userid column for foreign key
      type: DataTypes.INTEGER,
      // references: {
      //   model: UserModel, // Name of the Users table
      //   key: 'userid',  // Column name in the Users table
      // },
    }
  });
  // Define associations correctly
  return ProgressModel;
};
export default Progress;
