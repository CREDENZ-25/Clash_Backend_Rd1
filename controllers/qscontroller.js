// import MCQ from '../models/mcq';
// import Progress from '../models/progress';
// import User from '../models/User';
// import express from "express";
// import cookieParser from 'cookie-parser';

// const app = express();
// app.use(cookieParser());

//  app.post('/next-button',async(req,res)=>{
//       const {answer} = req.body.answer;
      
//     try{
//     const token = req.cookies.token;
        
//     if(!token){
//      return res.status(400).json({message:"error"});
//     }

//     const user= jwt.verify(token , 'your_secret_key');

//     if(!user){
//       return res.status(400).json({message:"error"});
//     }

//     const final_counter=await fetchCounterByUser(user);
//     const final_qarray= await fetchQuestionByUser(user);
//     const selected_ans=await fetchAnswerByUser(user);
//     const correct_ans=await fetchCorrectAnsByUser(user);

//     const check=final_counter-1;
//     try{
//       selected_ans[check]=answer;
//       Progress.update(
//         {Selectedans: selected_ans},
//         {
//           where:{
//             userid:user.id
//           }
//         }
//       )
//       if(selected_ans[check]=== correct_ans[check]){
//         Progress.update(
//           {Marks : Marks + 4 },
//           {
//             where:{
//               userid:user.id
//             }
//           }
          
//         )
//       }
//       else{
//         Progress.update(
//           {Marks : Marks - 1 },
//           {
//             where:{
//               userid:user.id
//             }
//           }
          
//         )
//       }
//     }catch(error){
//       console.log("unable to update", error);
//     }

//    // const final_option_array= await fetchOptionsbyUser(user);
   
//     const qid=final_qarray[final_counter];

//     const question_data=await MCQ.findOne({
//       attributes:['questions','options'],
//       where:{
//         id:qid
//       }
//     })

//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     return res.status(200).json({
//       question_data
//     });

//   }catch(error){
//     res.status(400).json({message:"error fetching question for this user!"});

//   }
        
//  })




// //1
// async function fetchCounterByUser(user) {
//    try {
//      const counter = await Progress.findOne({
//        attributes: ['counter'], 
//        where: {
//          userid: user.id, 
//        },
//      });


     
//       if(counter){
//         const currentCounter=counter;

//         const updated_counter = currentCounter + 1;
//         await Progress.update(
//           {counter : updated_counter},
//           {
//             where:{
//               userid:user.id,
//             }
//           }
          
//         )
//         return updated_counter;
//       }
//    } catch (error) {
//      console.error('Error getting counter:', error);
//      throw error;
//    }
//  }

//  //2
//  async function fetchQuestionByUser(user) {
//     try {
//       const qarray = await Progress.findOne({
//         attributes: ['Questionsid'], 
//         where: {
//           userid: user.id,
//         },
        
//       });
  
//       if (qarray) {
//        return qarray;
        
//       }
//     } catch (error) {
//       console.error('Error getting counter:', error);
//       throw error;
//     }
//   }

// //3)
// async function fetchAnswerByUser(user) {
//   try {
//     const ansarray = await Progress.findOne({
//       attributes: ['Selectedans'], 
//       where: {
//         userid: user.id,
//       },
      
//     });

//     if (ansarray) {
//      return ansarray;
      
//     }
//   } catch (error) {
//     console.error('cannot store selected ans', error);
//     throw error;
//   }
// }

// //4)
// async function fetchCorrectAnsByUser(user) {
//   try {
//     const correctans = await Progress.findOne({
//       attributes: ['Correctans'], 
//       where: {
//         userid: user.id,
//       },
      
//     });

//     if (correctans) {
//      return correctans;
      
//     }
//   } catch (error) {
//     console.error('Error getting correct ans', error);
//     throw error;
//   }
// }
// //3)
// /*async function fetchOptionsbyUser(user)
//   {
//     try{
//       const optionarray=await MCQ.findOne({
//         attributes:['options'],
//         where:{
//           userid : user.id,
//         },
//       })

//         if(optionarray){
//           return optionarray;
//         }

    
//     }catch(error){
//       console.log(error);
//       throw error;
//     }
    
//   }
//  */

import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";

const next = async (req, res) => {
  // console.log("NEXT!!!");
  const answer = req.body.answer;  
  if(answer==null){
    return res.status(500).json({error:"Error Null Value"});
  }
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found!" });
    }

    let userData;
    try {
      userData = await ProgressModel.findOne({
        attributes: ["Counter", "Questionsid", "Selectedans", "Correctans", "Marks","createdAt","Corrects"],
        where: {
          userid: userId,
        },
      });

      if (!userData) {
        return res.status(404).json({ message: "User progress not found!" });
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return res.status(500).json({ message: "Error fetching user progress" });
    }

    const correct_array = userData.Correctans;
    const selected_array = userData.Selectedans;
    const question_array = userData.Questionsid;
    const counter = userData.Counter;
    let Marks = userData.Marks;
   
    
  

    // console.log(correct_array, selected_array, question_array, counter);
    const check = correct_array[counter];
    // console.log(check);

    try {
      
   
        if (String(check) === String(answer)) {

              await ProgressModel.update(
              { Marks: Marks + 4, Selectedans: [...selected_array, answer], Counter: counter + 1,Corrects: userData.Corrects+1 },
               { where: { userid: userId } },

               Marks=Marks+4
        );
      } else {
        await ProgressModel.update(
          { Marks: Marks - 1, Selectedans: [...selected_array, answer], Counter: counter + 1 },
          { where: { userid: userId } },

          Marks=Marks-1
        );
      }
      
    } catch (error) {
      console.error("Unable to update progress:", error);
      return res.status(500).json({ message: "Error updating progress" });
    }

    let question_data;
    let marksData;
    if (counter===3){return res.status(202).json('Questions over');}
    let optionsObject=null;
    try {
      const qid = userData.Questionsid[counter + 1];
      question_data = await QuestionModel.findOne({
        attributes: ["questions", "options"],  //0 :new york
        where: { id: qid },
      });

      optionsObject = {
        0: question_data.options[0], 
        1: question_data.options[1],
        2: question_data.options[2],
        3: question_data.options[3],
    };
    
      
    } catch (error) {
      console.error("Error fetching next question:", error);
      return res.status(500).json({ message: "Error fetching next question" });
    }

    //time update Logic

    var float_time=0;
        
      const datetime = userData.createdAt; 
      console.log(datetime );
         const created= new Date(datetime).getTime();
         const updated = Date.now();

        //  console.log(created );
        //  console.log(updated);
        //time retrived in milli seconds so divid by 1000
         float_time= 1800 - ((updated)-(created))/1000 ;
         var timeleft = Math.round( float_time );
        //  console.log(timeleft);
        if (timeleft<=0){return res.status(404).json('Time over');}    
         console.log("minutes:" , Math.floor(timeleft/60));
         console.log("seconds:" , timeleft%60);

         
     return res.status(200).json({
            nextquestion:question_data.questions,
            optionsIndex:optionsObject,
            timedata:timeleft,
            marks: Marks,
         });



  } catch (error) {
    console.error("Error in next function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default next;