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
    if(!c){
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
  
          where: { id: questionId },
        });
  
        if (!questionData) {
          return res.status(404).json({ message: "Question not found!" });
        }
        const { questions, options } = questionData;
  
        optionsObject = {
          "0": questionData.options[0], 
          "1": questionData.options[1],
          "2": questionData.options[2],
          "3": questionData.options[3],
      };
  
        const timeleft = 1800//30min start time 
        return res.status(200).json({ questions, optionsObject, timeleft });
  
      
  
      } catch (error) {
        console.error('Error creating progress record:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }

    else{

      const quesid = c.Questionsid[c.Counter];

      const created=new Date(c.createdAt).getTime();
      const updated= new Date(c.updatedAt).getTime();

      float_time= 1800 - ((updated)-(created))/1000 ;
      var timeleft = Math.round( float_time );

      const finalObject= await MCQ.findOne({
        attributes:["questions", "options" ],
        where:{
          id:quesid,
        }
      })
      const Marks=c.Marks;
      return res.status(200).json({ finalObject , timeleft ,Marks });
    }

   
   

  } catch (error) {
    console.error("Error in start function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default start;