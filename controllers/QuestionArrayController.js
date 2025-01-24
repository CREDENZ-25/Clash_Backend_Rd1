const { progress, question } = require('../models'); // Assuming you have Sequelize models for Progress and Question

const addQuestion = async (req, res) => {
  /*
    This code defines a route to add a set of random questions to the user's progress.
    It retrieves all random questions from the Question table using Sequelize, 
    and then inserts these questions into the Progress table along with the user's ID.
    Once the questions are successfully added, it sends a response indicating that the quiz has started.
    If any error occurs during the process, a 500 status with an error message is returned.
  */

  const { userId } = req.body;
try{
  const questions = await question.findAll({
    attributes: ['id'], 
    order: Sequelize.literal('rand()'),
  });

  const questionIds = questions.map((q) => q.id);
 
  const progress = await progress.create({
    user_id: userId,
    questionsArray: JSON.stringify(questionIds), 
  });
  
    res.status(200).json({
      status: 'Quiz started',
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ error: 'from QuestionArray' });
  }
};

module.exports = addQuestion;
