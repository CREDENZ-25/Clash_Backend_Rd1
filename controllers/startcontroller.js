import { ProgressModel, UserModel } from "../config/db.js";
import { QuestionModel } from "../config/db.js";

const start = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    // Finding User's Progress Table
    const progress = await ProgressModel.findOne({
      where: { userid: userId },
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found!" });
    }

    const questionId = progress.Questionsid[progress.Counter]; // Questions ID

    const questionData = await QuestionModel.findOne({
      where: { id: questionId },
    });

    if (!questionData) {
      return res.status(404).json({ message: "Question not found!" });
    }

    const { question, options } = questionData;

    // await progress.increment('Counter',{by:1})
    res.status(200).json({ question, options });
  } catch (error) {
    console.error("Error in start function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default start;
