import { ProgressModel, UserModel } from "../config/db.js";
import { QuestionModel } from "../config/db.js";
import { Sequelize } from 'sequelize';

const start = async (req, res) => {
  try {
    const user = req.user;

    let questions;
    try {
      questions = await QuestionModel.findAll({
        attributes: ['id', 'correct'],
        where: { isJunior: user.isJunior },
        order: [
          Sequelize.fn('RANDOM')
        ]
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
        where: { id: questionId },
      });

      if (!questionData) {
        return res.status(404).json({ message: "Question not found!" });
      }
      const { question, options } = questionData;

      const timeleft = 1800//30min start time 
      return res.status(200).json({ question, options , timeleft });


    } catch (error) {
      console.error('Error creating progress record:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

  } catch (error) {
    console.error("Error in start function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default start;
