import { DataTypes } from 'sequelize';
export const User = (sequelize) => {
    return sequelize.define('User', {
    userid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,  
      allowNull: false,
      unique: true,  
      validate: {
        isEmail: true, 
      },
    },
    password: {
      type: DataTypes.STRING,  
      allowNull: false,
    },
    isJunior: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
  },
  {timestamps:false}
  
  );
};
export default User
