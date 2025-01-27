const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const { sequelize, User } = require('./models/User.js'); // Import Sequelize and models
const {question} = require('./models/question.js');
const questionRoutes = require('./routes/questionRoute.js');


// const userRoutes = require('./routes/userRoutes');
const cors=require('cors');

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
app.use('/api', questionRoutes); // Prefix routes with '/api'
// app.use('/api', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
