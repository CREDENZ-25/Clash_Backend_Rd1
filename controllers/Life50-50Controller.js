import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js"; // ✅ Ensure correct import

dotenv.config();

async function use5050Lifeline(req, res) {
  try {
    // ✅ 1. Extract the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // ✅ 2. Extract and verify the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    console.log("Extracted userId:", userId);

    // ✅ 3. Find the progress record using userId
    const progress = await ProgressModel.findOne({ 
      where: { userid: userId },
      attributes: ['id', 'Counter'] // ✅ Ensure correct column selection
    });

    if (!progress) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    const progressId = progress.id;
    const counter = progress.Counter; // ✅ Use 'Counter' exactly as in DB
    console.log(`ProgressId: ${progressId}, Counter: ${counter}`);

    // ✅ 4. Fetch the current question using Counter
    const question = await QuestionModel.findOne({
      where: { id: counter }, 
      attributes: ['id', 'options', 'correct'] // ✅ Ensure correct column names
    });

    console.log("Fetched Question:", question);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // ✅ 5. Ensure 'options' and 'correct' are valid
    if (!question.options || question.correct === undefined) {
      return res.status(500).json({ error: "'options' or 'correct' field is missing in the question" });
    }

    const { options, correct } = question;

    // ✅ 6. Apply 50-50 Lifeline Logic
    const incorrectIndices = options
      .map((_, index) => index) // Create an array of indices [0, 1, 2, 3]
      .filter((index) => index !== correct); // Remove the correct answer index

    if (incorrectIndices.length < 2) {
      return res.status(500).json({ error: "Not enough incorrect answers to apply 50-50" });
    }

    const shuffledIncorrectIndices = incorrectIndices.sort(() => 0.5 - Math.random());
    const reducedOptions = [options[correct], options[shuffledIncorrectIndices[0]]];

    console.log("Reduced Options:", reducedOptions);

    // ✅ 7. Mark 50-50 lifeline as used
    const isusedlifeline = [...progress.isusedlifeline];
    isusedlifeline[0] = true;
    await progress.update({ isusedlifeline });

    // ✅ 8. Return response with extracted data
    res.json({ userId, progressId, counter, options: reducedOptions });

  } catch (error) {
    console.error("Error using 50-50 lifeline:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export default use5050Lifeline;
