
// import Progress from '../models/progress.js';
// import express from "express";
// import cookieParser from 'cookie-parser';

// const app = express();
// app.use(cookieParser());
   
// async function getUser(){
//     try{
//         const token = req.cookies.token;
            
//         if(!token){
//          return res.status(400).json({message:"error"});
//         }
    
//         const user= jwt.verify(token , 'your_secret_key');
    
//         if(!user){
//           return res.status(400).json({message:"error"});
//         }
//         return user.id;
//     }catch(error){
//         console.log("Starting user error", error)
//     };
    
// }

// app.get('/start', async (req,res)=>{
//     try{
//         const user_id = getUser();
//         const qidarray= await Progress.findOne({
//             attributes: ['Questionsid'],
//             where:{
//                 userid:user_id,
//             }
//         })
//         const firstQ=qidarray[0];
//         const qaObject = await mcq.findOne({
//             attributes: ['questions','options'],
//             where:{
//                 id: firstQ,
//             }
//         })
        
//         return res.status(200).json(
//             qaObject
//         )
    
    
//     }catch(error){
//         console.log("Error sending first question",error);
//     }}
// )


import { ProgressModel, UserModel } from "../config/db.js";
import { QuestionModel } from "../config/db.js";
import { Sequelize } from 'sequelize';

const start = async (req, res) => {
  try {
    const user = req.user;
    let questions;
    const c = await ProgressModel.findOne({
            attributes:["Counter","Questionsid", "Marks","createdAt","updatedAt"],
            where:{
              userid : user.userId
            }

    })
    console.log(c);
    if(!c){
      console.log("i am here");
      try {
        questions = await QuestionModel.findAll({
          attributes: ['id', 'correct'],
          where: { isJunior: user.isJunior },
          order: Sequelize.literal('RANDOM()')
        });
      } catch (error) {
        console.error('Error fetching questions:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Array of Question Ids and Correct Options idx 
      const questionIds = questions.map((question) => question.id);
      const correctOptions = questions.map((question) => question.correct);
      let optionsObject=null;
     
      try {
        // Progress Table Created :)
        const currentProgress = await ProgressModel.create({
          userid: user.userId,
          Questionsid: questionIds,
          Correctans: correctOptions,
          isJunior: user.isJunior,
          Marks: 0,
          Counter: 0,
          Selectedans: [],
          Corrects:0,
          Lifeline:[],

        });
  
        if (!currentProgress) {
          return res.status(404).json({ message: "Progress not found!" });
        }
  
        const questionId = currentProgress.Questionsid[currentProgress.Counter]; // Questions ID
  
        const questionData = await QuestionModel.findOne({
          attributes: ["question","options"],
          where: { id: questionId },
        });
  
        if (!questionData) {
          return res.status(404).json({ message: "Question not found!" });
        }
        console.log("questionData", questionData);
        const { question, options } = questionData;
  
        optionsObject = {
          "0": questionData.options[0], 
          "1": questionData.options[1],
          "2": questionData.options[2],
          "3": questionData.options[3],
      };
  
        const timeleft = 1800//30min start time 
        return res.status(200).json({question, optionsObject, timeleft, "Marks":"0" });
  
      
  
      } catch (error) {
        console.error('Error creating progress record:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }

    else{

      if (c.Counter===c.Questionsid.length){return res.status(202).json('Questions over');}


      const quesid = c.Questionsid[c.Counter];
      console.log("quesid" , quesid);
      const created=new Date(c.createdAt).getTime();
      const updated= new Date(c.updatedAt).getTime();

      
      const float_time= 1800 - ((updated)-(created))/1000 ;
      var timeleft = Math.round( float_time );

      const questionData= await QuestionModel.findOne({
        attributes:["question", "options" ],
        where:{
          id:quesid,
        }
      })
      const optionsObject = {
        "0": questionData.options[0], 
        "1": questionData.options[1],
        "2": questionData.options[2],
        "3": questionData.options[3],
    };

      const {question,options}=questionData;
      const Marks=c.Marks;
      return res.status(200).json({ question,optionsObject , timeleft ,Marks });
    }

   
   

  } catch (error) {
    console.error("Error in start function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default start;