const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully!');
    return sequelize.sync(); // Ensure this is here
  })
  .then(() => {
    console.log('Models synced to the database!');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
module.exports = { sequelize, User };
