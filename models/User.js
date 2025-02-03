import { DataTypes } from 'sequelize';
export const User = (sequelize) => {
    return sequelize.define('User', {
    userid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
  }, {
    tableName: 'users', 
    timestamps: true,  
  },
  );
};
export default User
