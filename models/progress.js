import { DataTypes } from "sequelize";
import { UserModel } from "../config/db.js";
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
    userid: {  
      type: DataTypes.INTEGER,
      allownull:false,
      references:{model :UserModel,key:'userid'}
    },
    Corrects:{
      type: DataTypes.INTEGER,
      allownull:false,
    }
  });
  return ProgressModel;
};
export default Progress;
