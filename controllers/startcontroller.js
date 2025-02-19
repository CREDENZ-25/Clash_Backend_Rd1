import { ProgressModel, UserModel } from "../config/db.js";
import { QuestionModel } from "../config/db.js";
import { Sequelize } from 'sequelize';

const start = async (req, res) => {
  try {
    const user = req.user;
    let questions;
    const c = await ProgressModel.findOne({
            where:{
                userid:user.userId,
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


        const { question, options } = questionData;
  
        const optionsObject = {
          "0": questionData.options[0], 
          "1": questionData.options[1],
          "2": questionData.options[2],
          "3": questionData.options[3],
      };

      const lifelinestatus = {
        0:currentProgress.isUsedDoubleDip,
        1:currentProgress.isUsed5050,
        2:currentProgress.isUsedGamble
      }
      const Marks = currentProgress.Marks;
  
        const timeleft = 1800//30min start time 

        return res.status(200).json({ question, optionsObject, timeleft, Marks , lifelinestatus});

  
      
  
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
      const updated= Date.now();
      console.log(created,updated)

      const float_time= 1800 - ((updated)-(created))/1000 ;
      var timeleft = Math.round( float_time );

      const finalObject= await QuestionModel.findOne({

        attributes:["question", "options" ],
        where:{
          id:quesid,
        }
      })

      const question = finalObject.question;
      const options = finalObject.options;
      const Marks=c.Marks;
      const lifelinestatus = {
        0:c.isUsedDoubleDip,
        1:c.isUsed5050,
        2:c.isUsedGamble
      }
      return res.status(200).json({ question,options, timeleft ,Marks, lifelinestatus });

    }

   
   

  } catch (error) {
    console.error("Error in start function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default start;
