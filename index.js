import express from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes, Model  } from "sequelize";
import {MCQ, initMCQModel} from './models/mcq.js';
import {User, initUserModel} from './models/User.js';
import {Progress, initProgressModel} from './models/progress.js';
import cors from 'cors';
import {login} from './controllers/logincontroller.js';
import {start} from './controllers/startcontroller.js';
import {nextbutton} from './controllers/qscontroller.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
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
     
}) .catch(console.error);
     sequelize
    .sync({ alter: true }) // `alter: true` updates tables without dropping data
    .then(() => console.log("Database synced successfully"))
   
    const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
   



//login request



    login();
    start();
    nextbutton();
    

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {app};