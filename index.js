import express from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes, Model  } from "sequelize";
import {MCQ, initMCQModel} from './models/mcq.js';
import {User, initUserModel} from './models/User.js';
import {Progress, initProgressModel} from './models/progress.js';
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
      await initUserModel(sequelize);
     await initProgressModel(sequelize); // Call the function to initialize the model
     await initMCQModel(sequelize);
     
})
    .catch(console.error);
    const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




//login request
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user=await User.findOne({
          attributes:['password','id','isJunior'],
          where:{
            email:email,
          }
        })

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
        }

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password is incorrect!' });
    }

    const token = jwt.sign({ userId: user.id ,category: user.isJunior}, 'your_secret_key', { expiresIn: '1h' });
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
})




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
