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



async function nextbutton() {
  app.post('/next-button',async(req,res)=>{
    const answer = req.body.answer;
    console.log(answer);
  try{
  const token = req.cookies.token;
  
  if(!token){
   return res.status(400).json({message:"error"});
  }
  console.log("tokenized!");


  const user= jwt.verify(token , 'your_secret_key');
  console.log("verified!");

  if(!user){
    console.log("not user!");
    return res.status(400).json({message:"error"});
    
  }
  console.log(user);

 
  //1)
  
    const userData= await Progress.findOne({
      attributes: ['Counter','Questionsid','Selectedans','Correctans','Marks','createdAt'], 
      where: {
        userid: user.userId, 
      },
      raw:true,
  }
  )
  
  console.log(userData);
 
  var selected_ans=userData.Selectedans;
  const correct_ans=userData.Correctans;

  const check=userData.Counter;
  console.log(check);
  try{
    selected_ans[check]=answer;
    var Marks = userData.Marks;
    console.log(Marks);
    console.log(selected_ans[check]);
    console.log(correct_ans[check]);
    if (String(selected_ans[check]) === String(correct_ans[check])){
      await Progress.update(
        {Marks : Marks + 4 ,Selectedans: selected_ans, Counter:check+1 },
        {
          where:{
            userid:user.userId
          }
        }
        
      )
    }
    else{
     await Progress.update(
        {Marks : Marks - 1 ,Selectedans: selected_ans, Counter:check+1 },
        {
          where:{
            userid:user.userId
          }
        }
        
      )
    }
  }catch(error){
    console.log("unable to update", error);
  }

 // const final_option_array= await fetchOptionsbyUser(user);
 
  const qid=userData.Questionsid[check+1];

  const question_data=await MCQ.findOne({
    attributes:['questions','options'],
    where:{
      id:qid
    }
  })

  if (!question_data) {
    return res.status(404).json({ message: "Question not found" });
  }
        
         var float_time=0;
        
         console.log(userData.createdAt );
         const datetime = userData.createdAt; // Example datetime string
         const created= new Date(datetime).getTime();
         const updated = Date.now();

         console.log(created );
         console.log(updated);
         float_time= 1800 - ((updated)-(created))/1000 ;
         var timeleft = Math.round( float_time );
         console.log(timeleft);
         
         console.log("minutes:" , Math.floor(timeleft/60));
         console.log("seconds:" , timeleft%60);

     return res.status(200).json({
            nextquestion:question_data,
            timedata:timeleft
         });

}catch(error){
  res.status(400).json({message:"error fetching question for this user!"});

}
      
})
}
 export {nextbutton}