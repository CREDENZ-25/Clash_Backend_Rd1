import jwt from 'jsonwebtoken';
import {app} from '../index.js';
import express from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes, Model  } from "sequelize";
import {MCQ, initMCQModel} from '../models/mcq.js';
import {User, initUserModel} from '../models/User.js';
import {Progress, initProgressModel} from '../models/progress.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



async function start() {
    
    app.get('/start', async (req,res)=>{
        console.log("hi");
     try{
         const token=req.cookies.token;
         if(!token){
           console.log("token not got");
             return res.status(401).json({message:"token invalidated"});
           
         }
        
         const {userId,category}=jwt.verify(token , 'your_secret_key');
         console.log("jwt successful");
         console.log(userId);
         var junior=0;
         if (category){
           junior=1;
         }
        
         
         const questions = await MCQ.findAll({
             attributes: ['id', 'correct'], 
             where: { isJunior : junior} , 
             order: Sequelize.literal('random()'), 
             raw:true,
           });
          console.log(questions);
           const questionIds = questions.map((q) => q.id);
           const correctAnswers = questions.map((q) => q.correct);
       
           console.log(questionIds);
           console.log(correctAnswers);
           await Progress.create({
             userid: userId,
             Questionsid: questionIds, 
             Correctans: correctAnswers, 
             isJunior:category,
             Marks:0,
             Counter:0,
             Selectedans: [],
             
           }); 
           console.log("prpgress table created");
         
 
   
        
         const qidarray= questionIds;
         const firstQ=qidarray[0];
         const qaObject = await MCQ.findOne({
             attributes: ['questions','options'],
             where:{
                 id: firstQ,
             },
             raw:true,
         })
         var timeleft=0;
         const timedata= await Progress.findOne({
            attributes :['createdAt' , 'updatedAt'],
            where:{
              userid: userId,
            },
            raw:true,
         })
         console.log(timedata.createdAt );
         console.log(timedata.updatedAt) ;
         timeleft=1800 - ((timedata.updatedAt)-(timedata.createdAt)) ;

         console.log(timeleft);
         return res.status(200).json(
          {
            questiondata: qaObject,
            timedata:timeleft
          }
            
         )
     
     
     }catch(error){
         console.log("Error sending first question",error);
     }}
 )
}

  export {start}