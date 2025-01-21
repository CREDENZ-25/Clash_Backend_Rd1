
const { progress, question } = require('../models');
const addQuestion= async (req, res) => {
  /*
    This code defines a route to add a set of random questions to the user's progress.
     It retrieves 10 random questions from the questions table using an SQL query and then 
     inserts these questions into the progress table along with the user's ID. 
     Once the questions are successfully added, it sends a response indicating that the quiz has started. 
     If any error occurs during the process, a 500 status with an error message is returned.
  */
     try {
        // Fetch 10 random questions using Sequelize
        const questions = await Question.findAll({
          order: Sequelize.literal('rand()'), // Random order
          limit: 10, // Limit to 10 questions
        });
        
        // Create a progress record with the userId and the fetched questions
        const progress = await Progress.create({
          user_id: userId,
          questionsArray: JSON.stringify(questions), // Store questions as a string or JSON
        });
    
        res.status(200).json({
          status: 'Questions added',
        });
      } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'from QuestionArray' });
      }
    };
    
    module.exports = addQuestion;