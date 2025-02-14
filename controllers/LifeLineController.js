const { Sequelize } = require("sequelize");
const { Question } = require("../models/Question");
const { Progress } = require("../models/Progress");

// Initialize Sequelize connection
const sequelize = new Sequelize("your_database", "your_username", "your_password", {
  host: "localhost",
  dialect: "postgres",
});

/**
 * Helper function to get the current question ID for a user.
 */
async function getCurrentQuestionId(userId, transaction) {
  const progress = await Progress.findOne({ where: { userId }, transaction });
  if (!progress) throw new Error("Progress record not found");
  return progress.questionIds[progress.counter]; // Get current question ID
}

/**
 * Helper function to fetch the current question for a user.
 */
async function getCurrentQuestion(userId, transaction) {
  const questionId = await getCurrentQuestionId(userId, transaction);
  const question = await Question.findByPk(questionId, { transaction });
  if (!question) throw new Error("Question not found");
  return question;
}

/**
 * 50-50 Lifeline: Removes two incorrect options.
 */
async function use5050Lifeline(req) {
  const transaction = await sequelize.transaction();
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

    const reducedOptions = [optionArray[answerIdx], optionArray[incorrectIndices[0]]];

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
async function useGetMoreOrLoseMore(req, userAnswerIndex) {
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
    throw error;
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

module.exports = { use5050Lifeline, useGetMoreOrLoseMore, useDoubleDipLifeline };
