const addQuestion= async (req, res) => {
  /*
    This code defines a route to add a set of random questions to the user's progress.
     It retrieves 10 random questions from the questions table using an SQL query and then 
     inserts these questions into the progress table along with the user's ID. 
     Once the questions are successfully added, it sends a response indicating that the quiz has started. 
     If any error occurs during the process, a 500 status with an error message is returned.
  */
    const { userId } = req.body; 
  
    try {
      const result = await client.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT 10');
      const questions = result.rows;
  
      const progress = await client.query(
        'INSERT INTO progress (user_id, questionsArray) VALUES ($1, $2) RETURNING *',
        [userId, questions] 
      );
  
      res.status(200).json({
        status: 'Quiz started',
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
      res.status(500).json({ error: 'from QuestionArray' });
    }
  };
  module.exports = addQuestion;
  