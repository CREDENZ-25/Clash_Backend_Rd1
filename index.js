<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
//import {MCQ, initMCQmodel} from './models/mcq.js';
import {Clash, initClashModel} from './models/User.js';
=======
const express = require('express');
const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes');
const cors=require('cors');

dotenv.config();
>>>>>>> 70e9235cce44ca1ccc0febc2a62f058b5215811f

import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config();
const{DB_HOST,DB_USER,DB_DB, DB_PASS } = process.env;
    const sequelize = new Sequelize(DB_DB, DB_USER, DB_PASS,{
        host: DB_HOST,
        dialect: 'postgres',
    });

    sequelize
    .authenticate()
    .then(async ()=> {console.log('Connected');
    await initClashModel(sequelize); // Call the function to initialize the model
    
     
})
    .catch(console.error);
    const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//login function


/*app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Clash.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ message: 'Clash not found!' });
        }

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password is incorrect!' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,  // Helps to prevent XSS attacks
      secure: process.env.NODE_ENV === 'production',  // Set to true if using HTTPS in production
      maxAge: 3600000,  // Optional: expires in 1 hour
    });
    
   return res.status(200).json({ message: 'Login successful' });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});*/

const newUser  = await Clash.create({
  email: 'Doe',
  password: 'john'
  
});
console.log('User  added:', newUser .toJSON());


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
