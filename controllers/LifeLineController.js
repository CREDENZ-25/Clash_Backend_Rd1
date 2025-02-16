const { Sequelize } = require("sequelize");
const { Question } = require("../models/Question");
const { Progress } = require("../models/progress");

async function getCurrentQuestionId(userId, transaction) {
  const progress = await Progress.findOne({ where: { userId }, transaction });
  if (!progress) throw new Error("Progress record not found");
  return progress.questionIds[progress.counter]; // Get current question ID
}
async function getCurrentQuestion(userId, transaction) {
  const questionId = await getCurrentQuestionId(userId, transaction);
  const question = await Question.findByPk(questionId, { transaction });
  if (!question) throw new Error("Question not found");
  return question;
}

async function use5050Lifeline(req) {
  // const transaction = await sequelize.transaction();
  const userId = req.user.id;

  try {
    const progress = await Progress.findOne({ where: { userId }, transaction });
    const question = await getCurrentQuestion(userId, transaction);

    // Ensure lifeline isn't already used on another question
    if (progress.isusedlifeline[0] !== -1)
      throw new Error("50-50 lifeline already used on question ID " + progress.isusedlifeline[0]);

    const { optionArray, answerIdx } = question;
    const incorrectIndices = optionArray
      .map((_, index) => index)
      .filter((index) => index !== answerIdx)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const reducedOptions = [option[answerIdx], optionArray[incorrectIndices[0]]];

    // Mark lifeline as used on this question
    progress.isusedlifeline[0] = question.id;

    await progress.update({ isusedlifeline: progress.isusedlifeline }, { transaction });
    await transaction.commit();
    return reducedOptions;
  } catch (error) {
    console.error("Error using 50-50 lifeline:", error.message);
    await transaction.rollback();
    throw error;
  }
}

/**
 * GetMoreOrLoseMore Lifeline: Doubles or loses double the points based on correctness.
 */
async function useGamble(req, userAnswerIndex) {
  const transaction = await sequelize.transaction();
  const userId = req.user.id;

  try {
    const progress = await Progress.findOne({ where: { userId }, transaction });
    const question = await getCurrentQuestion(userId, transaction);

    // Ensure lifeline isn't already used on another question
    if (progress.isusedlifeline[1] !== -1)
      throw new Error("GetMoreOrLoseMore lifeline already used on question ID " + progress.isusedlifeline[1]);

    const { answerIdx, points } = question;
    const isCorrect = userAnswerIndex === answerIdx;
    const scoreChange = isCorrect ? points * 2 : points * -2;

    progress.score += scoreChange;
    progress.isusedlifeline[1] = question.id;

    await progress.update({ score: progress.score, isusedlifeline: progress.isusedlifeline }, { transaction });
    await transaction.commit();
    return { success: true, isCorrect, scoreChange };
  } catch (error) {
    console.error("Error using GetMoreOrLoseMore lifeline:", error.message);
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Double Dip Lifeline: Allows two guesses before marking incorrect.
 */
async function useDoubleDipLifeline(req, firstGuessIndex, secondGuessIndex = null) {
  const transaction = await sequelize.transaction();
  const userId = req.user.id;

  try {
    const progress = await Progress.findOne({ where: { userId }, transaction });
    const question = await getCurrentQuestion(userId, transaction);

    // Ensure lifeline isn't already used on another question
    if (progress.isusedlifeline[2] !== -1)
      throw new Error("Double Dip lifeline already used on question ID " + progress.isusedlifeline[2]);

    const { answerIdx, points } = question;
    let updatedScore = progress.score;
    let isFirstGuessCorrect = firstGuessIndex === answerIdx;
    let isSecondGuessCorrect = false;

    if (isFirstGuessCorrect) {
      updatedScore += points;
    } else if (secondGuessIndex !== null) {
      isSecondGuessCorrect = secondGuessIndex === answerIdx;
      if (isSecondGuessCorrect) updatedScore += points;
    }

    progress.score = updatedScore;
    progress.isusedlifeline[2] = question.id;

    await progress.update({ score: progress.score, isusedlifeline: progress.isusedlifeline }, { transaction });
    await transaction.commit();

    return { success: true, isFirstGuessCorrect, isSecondGuessCorrect, updatedScore };
  } catch (error) {
    console.error("Error using Double Dip lifeline:", error.message);
    await transaction.rollback();
    throw error;
  }
}
const set5050Lifeline =async (req, res) => 
{
  const userId = req.user.id;

  try {
    const progress = await Progress.findOne({ where: { userId }});
    if (progress.isUsed5050 ==false)
      return res.status(400).json({ error: `50-50 lifeline already used`});
  progress.isUsed5050=true;
  await progress.update({ isUsed5050:progress.isUsed5050 });

  }
  catch(error){
      console.error("Error using 50-50 lifeline:", error.message);
      throw error;
  }

}
const setGambleLifeline =async (req, res) => 
  {
    const userId = req.user.id;
  
    try {
      const progress = await Progress.findOne({ where: { userId }});
      if (progress.isUsedGamble ==null)
        return res.status(400).json({ error: `Gamble lifeline already used`});
    progress.isUsedGamble=true;
    await progress.update({ isUsedGamble:progress.isUsedGamble });
  
    }
    catch(error){
        console.error("Error using 50-50 lifeline:", error.message);
        throw error;
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
module.exports = { setDoubleDipLifeline,setGambleLifeline,set5050Lifeline };
