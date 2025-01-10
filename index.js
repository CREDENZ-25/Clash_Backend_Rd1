const express = require('express');
const dotenv = require('dotenv');
const { sequelize, User } = require('./models/User'); // Import Sequelize and models

// const userRoutes = require('./routes/userRoutes');
//Let's Go
dotenv.config();

const app = express();


// Test the database connection
sequelize
  .authenticate() 
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Error connecting to the database:', err));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});