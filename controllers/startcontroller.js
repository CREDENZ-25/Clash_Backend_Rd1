import Progress from '../models/progress.js';
import express from "express";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
   
async function getUser(){
    try{
        const token = req.cookies.token;
            
        if(!token){
         return res.status(400).json({message:"error"});
        }
    
        const user= jwt.verify(token , 'your_secret_key');
    
        if(!user){
          return res.status(400).json({message:"error"});
        }
        return user.id;
    }catch(error){
        console.log("Starting user error", error)
    };
    
}

app.get('/start', async (req,res)=>{

    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"token invalidated"});
        }

        const {userid,category}=jwt.verify(token , 'your_secret_key');
        
        const questions = await MCQ.findAll({
            attributes: ['id', 'correct'], 
            where: { isJunior : category} , 
            order: Sequelize.literal('rand()'), 
          });
      
          const questionIds = questions.map((q) => q.id);
          const correctAnswers = questions.map((q) => q.correct);
      
          await Progress.create({
            userid: userid,
            Questionsid: JSON.stringify(questionIds), 
            Correctans: JSON.stringify(correctAnswers), 
            isJunior:category,
            Marks:0,
            Counter:0,
            Selectedans:[],
            start_timer:new Date()
          });

        

    }catch(error){
        console.log("progress table not created properly!")
    }
    try{
        const user_id = getUser();
        const qidarray= await Progress.findOne({
            attributes: ['Questionsid'],
            where:{
                userid:user_id,
            }
        })
        const firstQ=qidarray[0];
        const qaObject = await mcq.findOne({
            attributes: ['questions','options'],
            where:{
                id: firstQ,
            }
        })
        
        return res.status(200).json(
            qaObject
        )
    
    
    }catch(error){
        console.log("Error sending first question",error);
    }}
)

