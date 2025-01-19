const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Database connection
const sequelize = new Sequelize({
  username: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  host: process.env.DB_HOST, // Database host
  dialect: 'postgres', // Database type
  port: process.env.DB_PORT || 5432, // Database port
});

// Test the connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully!');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synced to the database!');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

// Define the Question model
// Define the Question model
const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Explicitly set 'id' as the primary key
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false, // Question text is required
  },
  options: {
    type : DataTypes.ARRAY(DataTypes.STRING),
    allowNull : false
  },
  correctOptionIndex : {
    type : DataTypes.INTEGER,
    allowNull : false
  }
}, {
  timestamps: false, // Disable createdAt and updatedAt columns
});


module.exports = { sequelize, Question };
