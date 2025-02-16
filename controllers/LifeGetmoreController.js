
import  Question  from "../models/questions.js";
import Progress from "../models/progress.js";
import dotenv from 'dotenv';
dotenv.config();

// Function to implement the GetMoreOrLoseMore lifeline
async function useGetMoreOrLoseMore(questionId, progressId, userAnswerIndex) {
  const transaction = await sequelize.transaction();

  try {
    const question = await Question.findByPk(questionId, { transaction });
    if (!question) throw new Error("Question not found");

    const { answerIdx, points } = question;
    
    const isCorrect = userAnswerIndex === answerIdx;
    const scoreChange = isCorrect ? 8  : -4 ;

    const progress = await Progress.findByPk(progressId, { transaction });
    if (!progress) throw new Error("Progress record not found");

    const updatedScore = progress.score + scoreChange;
    const isusedlifeline = [...progress.isusedlifeline];
    isusedlifeline[2] = true;

    await progress.update({
      score: updatedScore,
      isusedlifeline,
    }, { transaction });

    await transaction.commit();

    return {
      success: true,
      isCorrect,
      scoreChange,
    };
  } catch (error) {
    console.error("Error using GetMoreOrLoseMore lifeline:", error.message);
    await transaction.rollback();
    throw error;
  }
}
export default useGetMoreOrLoseMore ;