import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js"; 

dotenv.config();

async function use5050Lifeline(req, res) {
  try {
   
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    console.log("Extracted userId:", userId);

    const progress = await ProgressModel.findOne({ 
      where: { userid: userId },
      attributes: ['id', 'Counter'] 
    });

    if (!progress) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    const progressId = progress.id;
    const counter = progress.Counter; 
    console.log(`ProgressId: ${progressId}, Counter: ${counter}`);

    const question = await QuestionModel.findOne({
      where: { id: counter }, 
      attributes: ['id', 'options', 'correct'] 
    });

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

    const isusedlifeline = [...progress.isusedlifeline];
    isusedlifeline[0] = true;
    await progress.update({ isusedlifeline });

    res.json({  options: reducedOptions });

  } catch (error) {
    console.error("Error using 50-50 lifeline:", error.message);
    res.status(500).json({ error: error.message });
  }



}

const setDoubleDipLifeline =async (req, res) => 
  {
    const userId = req.user.id;
  
    try {
      const progress = await Progress.findOne({ where: { userId }});
      if (progress.isUsedDoubleDip ==null)
        return res.status(400).json({ error: `Double Dip lifeline already used`});
    progress.isUsedDoubleDip=true;
    await progress.update({ isUsedDoubleDip:progress.isUsedDoubleDip });
  
    }
    catch(error){
        console.error("Error using 50-50 lifeline:", error.message);
        throw error;
    }
  }

export default {use5050Lifeline , setDoubleDipLifeline} ;
