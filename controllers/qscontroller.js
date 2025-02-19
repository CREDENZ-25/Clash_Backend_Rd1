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

    const final_counter=await fetchCounterByUser(user);
    const final_qarray= await fetchQuestionByUser(user);
    const selected_ans=await fetchAnswerByUser(user);
    const correct_ans=await fetchCorrectAnsByUser(user);

    const check=final_counter-1;
    try{
      selected_ans[check]=answer;
      Progress.update(
        {Selectedans: selected_ans},
        {
          where:{
            userid:user.id
          }
        }
      )
      if(selected_ans[check]=== correct_ans[check]){
        Progress.update(
          {Marks : Marks + 4 },
          {
            where:{
              userid:user.id
            }
          }
          
        )
      }
      else{
        Progress.update(
          {Marks : Marks - 1 },
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
   
    const qid=final_qarray[final_counter];

    const question_data=await MCQ.findOne({
      attributes:['questions','options'],
      where:{
        id:qid
      }
    })

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({
      question_data
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
        return updated_counter;
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
async function fetchAnswerByUser(user) {
  try {
    const ansarray = await Progress.findOne({
      attributes: ['Selectedans'], 
      where: {
        userid: user.id,
      },
      
    });

    if (ansarray) {
     return ansarray;
      
    }
  } catch (error) {
    console.error('cannot store selected ans', error);
    throw error;
  }
}

//4)
async function fetchCorrectAnsByUser(user) {
  try {
    const correctans = await Progress.findOne({
      attributes: ['Correctans'], 
      where: {
        userid: user.id,
      },
      
    });

    if (correctans) {
     return correctans;
      
    }
  } catch (error) {
    console.error('Error getting correct ans', error);
    throw error;
  }
}
//3)
/*async function fetchOptionsbyUser(user)
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
 */