import { DataTypes } from "sequelize";
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
    }
  });
  return ProgressModel;
};
export default Progress;
