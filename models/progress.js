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
      allownull: false,
      references: { model: UserModel, key: "userid" },
    },
    Corrects: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    isUsed5050: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
    isUsedGamble: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
    isUsedDoubleDip: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  });
  return ProgressModel;
};
export default Progress;
