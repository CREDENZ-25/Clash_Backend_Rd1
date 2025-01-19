const { progress } = require('../models');
const startTest= async (req, res) => {
   
/*
This code starts a test for the user by creating a progress record with the user's ID and the current timestamp. 
It then sets a timer to automatically submit the test after 30 minutes. Once the time is up, the test is submitted, 
and a response is sent to the client indicating the test is complete. If an error occurs, a 500 status with an error 
message is returned.
  */
  const userId = req.user.id; 

    try {
      const progress = await Progress.create({
        userId,
        startTime: new Date(),  
      });
  
      setTimeout(async () => {
        await submitTest(progress.id);  
        res.json({
          message: 'test competle',
        });
      }, 1800000); 
  
    } catch (error) {
      console.error('Error starting the test:', error);
      res.status(500).json({ message: 'Error starting the test' });
    }
  };
  module.exports = startTest;
  
