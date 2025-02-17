import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js"; 

dotenv.config();

async function use5050Lifeline(req, res) {

  
  try {
   
    const userId = req.user.userId;

    const progress = await ProgressModel.findOne({ 
      where: { userid: userId },
      attributes: ['id', 'Counter','isUsed5050','Questionsid'] 
    });

    console.log("progress: ", progress);


    if (!progress) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    if(progress.isUsed5050 === false){
      return res.status(404).json({ error: "50-50 used" });
    }


    // const progressId = progress.id;
    const counter = progress.Counter; 
    console.log("counter : ",counter );
  
    // console.log(`ProgressId: ${progressId}, Counter: ${counter}`);
    const qid = progress.Questionsid[counter]
    const question = await QuestionModel.findOne({
      where: { id: qid }, 
      attributes: ['id', 'options', 'correct'] 
    });

    console.log("quesid : ",qid );
    console.log("Fetched Question:", question);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!question.options || question.correct === undefined) {
      return res.status(500).json({ error: "'options' or 'correct' field is missing in the question" });
    }

    const { options, correct } = question;

    const incorrectIndices = options
      .map((_, index) => index) 
      .filter((index) => index !== correct); 

    if (incorrectIndices.length < 2) {
      return res.status(500).json({ error: "Not enough incorrect answers to apply 50-50" });
    }

    const shuffledIncorrectIndices = incorrectIndices.sort(() => 0.5 - Math.random());
    const reducedOptions = [options[correct], options[shuffledIncorrectIndices[0]]];

    console.log("Reduced Options:", reducedOptions);

    progress.isUsed5050=false;
    await progress.update({ isUsed5050: false });


    
    res.json({  options: reducedOptions });

  } catch (error) {
    console.error("Error using 50-50 lifeline:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export default use5050Lifeline;
