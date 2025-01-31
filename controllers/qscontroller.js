import MCQ from '../models/mcq';
import Progress from '../models/progress';
import User from '../models/User';
import express from "express";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

 app.post('/next-button',async(req,res)=>{
      const {answer} = req.body.answer;
      
    try{
    const token = req.cookies.token;
        
    if(!token){
     return res.status(400).json({message:"error"});
    }

    const user= jwt.verify(token , 'your_secret_key');

    if(!user){
      return res.status(400).json({message:"error"});
    }

    //1)
    const userData= await Progress.findOne({
        attributes: ['counter','Questionsid','Selectedans','Correctans'], 
        where: {
          userid: user.id, 
        },
    }
    )
    
  

    const selected_ans=userData.Selectedans;
    const correct_ans=userData.Correctans;

    const check=userData.counter;
    try{
      selected_ans[check]=answer;
      if(selected_ans[check]=== correct_ans[check]){
        Progress.update(
          {Marks : Marks + 4 ,Selectedans: selected_ans, counter:check+1 },
          {
            where:{
              userid:user.id
            }
          }
          
        )
      }
      else{
        Progress.update(
          {Marks : Marks - 1 ,Selectedans: selected_ans, counter:check+1 },
          {
            where:{
              userid:user.id
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

    return res.status(200).json({
      question_data
    });

  }catch(error){
    res.status(400).json({message:"error fetching question for this user!"});

  }
        
 })