const { progress, question } = require('../models'); // Assuming you have Sequelize models for Progress and Question

const addQuestion = async (req, res) => {
  /*
    This code adds random questions to the user's progress, filtering by category (junior/senior).
    It fetches `id` and `correct_option` for the selected questions and saves them 
    in the `Progress` table along with the user's ID and category.
  */

  const { userId, category } = req.body;

  try {

    const isJunior = category.toLowerCase() === 'junior';

    const questions = await question.findAll({
      attributes: ['id', 'correct_option'], 
      where: { isJunior }, 
      order: Sequelize.literal('rand()'), 
    });

    const questionIds = questions.map((q) => q.id);
    const correctAnswers = questions.map((q) => q.correct_option);

    await progress.create({
      user_id: userId,
      questionsArray: JSON.stringify(questionIds), 
      Correctans: JSON.stringify(correctAnswers), 
      category, 
    });

    res.status(200).json({
      status: 'Quiz started',
      category,
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ error: 'Error adding questions to progress' });
  }
};

module.exports = addQuestion;
