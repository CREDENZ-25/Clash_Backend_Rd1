const { Sequelize, DataTypes, Op } = require("sequelize");
const { Question } = require("../models/Question");
const { Progress } = require("../models/Progress");

// Initialize Sequelize connection
const sequelize = new Sequelize("your_database", "your_username", "your_password", {
  host: "localhost",
  dialect: "postgres",
});

// Function to use the 50-50 lifeline
async function use5050Lifeline(questionId, progressId) {
  const transaction = await sequelize.transaction();

  try {
    const question = await Question.findByPk(questionId, { transaction });
    if (!question) throw new Error("Question not found");

    const { optionArray, answerIdx } = question;
    const incorrectIndices = optionArray.map((_, index) => index).filter((index) => index !== answerIdx);
    const shuffledIncorrectIndices = incorrectIndices.sort(() => 0.5 - Math.random());
    const selectedIncorrectIndices = shuffledIncorrectIndices.slice(0, 2);
    const reducedOptions = [optionArray[answerIdx], optionArray[selectedIncorrectIndices[0]]];

    const progress = await Progress.findByPk(progressId, { transaction });
    if (!progress) throw new Error("Progress record not found");

    const isusedlifeline = [...progress.isusedlifeline];
    isusedlifeline[0] = true;

    await progress.update({ isusedlifeline }, { transaction });
    await transaction.commit();

    return reducedOptions;
  } catch (error) {
    console.error("Error using 50-50 lifeline:", error.message);
    await transaction.rollback();
    throw error;
  }
}

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

module.exports = { use5050Lifeline, useGetMoreOrLoseMore };
