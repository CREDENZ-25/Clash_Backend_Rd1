const submitTest = async (req,res)=>{
   
/*
    The code handles the submission of quiz answers. It extracts the user ID and answers, 
    then fetches all questions from the database. For each answer, it compares the selected option with the correct one. 
    If correct, the score increases. The results (correct or incorrect) are saved in an array. Finally, 
    the user’s score and results are updated in the database, and the response is sent back to the frontend.
*/

        const { userId, userAnswers } = req.body;
      
        try {
       
          const allQuestions = await Questions.findAll();
      
          let score = 0;
          const result = []; 
          for (let i = 0; i < userAnswers.length; i++) {
            const userAnswer = userAnswers[i];
      
            let question = null;
            for (let j = 0; j < allQuestions.length; j++) {
              if (allQuestions[j].id === userAnswer.questionId) {
                question = allQuestions[j];
                break;
              }
            }
      
            if (question) {
              const isCorrect = question.correct_option === userAnswer.selectedOption;
              if (isCorrect) {
                score++;
              }
      
              result.push({
                questionId: userAnswer.questionId,
                selectedOption: userAnswer.selectedOption,
                isCorrect: isCorrect,
              });
            } else {
              result.push({
                questionId: userAnswer.questionId,
                selectedOption: userAnswer.selectedOption,
                isCorrect: false, // Invalid question ID
              });
            }
          }
    
          await Progress.update(
            { score: score},
            { where: { user_id: userId } }
          ); 
      
          res.status(200).json({ score: score, result: result });
        } catch (error) {
          console.error('Error validating answers:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };
      
    