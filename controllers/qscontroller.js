import MCQ from '../models/mcq';
import Progress from '../models/progress';
import User from '../models/User';
import express from "express";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

 app.post('/next-button',async(req,res)=>{

  try{
    const token = req.cookies.token;
        
    if(!token){
     return res.status(400).json({message:"error"});
    }

    const user= jwt.verify(token , 'your_secret_key');

    if(!user){
      return res.status(400).json({message:"error"});
    }

    const final_counter=await fetchCounterByUser(user);
    const final_qarray= await fetchQuestionByUser(user);
    const final_option_array= await fetchOptionsbyUser(user);

    const qid=final_qarray[final_counter];

    const question=await MCQ.findOne({
      attributes:['questions'],
      where:{
        id:qid
      }
    })

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({
      question: question,
      options: final_option_array,
    });

  }catch(error){
    res.status(400).json({message:"error fetching question for this user!"});

  }
        
 })





//1
async function fetchCounterByUser(user) {
   try {
     const counter = await Progress.findOne({
       attributes: ['counter'], 
       where: {
         userid: user.id, 
       },
     });


     
      if(counter){
        const currentCounter=counter;

        const updated_counter = currentCounter + 1;
        await Progress.update(
          {counter : updated_counter},
          {
            where:{
              userid:user.id,
            }
          }
          
        )
        return counter;
      }
   } catch (error) {
     console.error('Error getting counter:', error);
     throw error;
   }
 }

 //2
 async function fetchQuestionByUser(user) {
    try {
      const qarray = await Progress.findOne({
        attributes: ['Questionsid'], 
        where: {
          userid: user.id,
        },
        
      });
  
      if (qarray) {
       return qarray;
        
      }
    } catch (error) {
      console.error('Error getting counter:', error);
      throw error;
    }
  }
//3)
async function fetchOptionsbyUser(user)
  {
    try{
      const optionarray=await MCQ.findOne({
        attributes:['options'],
        where:{
          userid : user.id,
        },
      })

        if(optionarray){
          return optionarray;
        }

    
    }catch(error){
      console.log(error);
      throw error;
    }
    
  }
 