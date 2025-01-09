const express = require('express');
//initial commit by akanksha
const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

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