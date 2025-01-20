const { progress } = require('../models'); // Assuming Progress model is correctly imported

const startTest = async (req, res) => {
  /*
    This code starts a test for the user by creating a progress record with the user's ID and the current timestamp. 
    It then sets a timer to automatically submit the test after 30 minutes. Once the time is up, the test is submitted, 
    and a response is sent to the client indicating the test is complete. If an error occurs, a 500 status with an error 
    message is returned.
  */

  const userId = req.user.id;  // Extracting user ID from the authenticated user

  try {
    // Create a progress record in the database using Sequelize
    const progress = await Progress.create({
      user_id: userId,          // Store the user's ID
      start_time: new Date(),    // Store the current timestamp as the start time
    });

    // Set a timer for 30 minutes (1800000ms) to submit the test
    setTimeout(async () => {
      try {
        // After 30 minutes, call the submitTest function to submit the test
        await submitTest(progress.id);

        // Respond with a message indicating that the test is complete
        res.json({
          message: 'Test complete',
        });
      } catch (submitError) {
        console.error('Error submitting the test:', submitError);
        res.status(500).json({ message: 'Error submitting the test' });
      }
    }, 1800000);  // 30 minutes in milliseconds

  } catch (error) {
    // Handle any errors that occur when creating the progress record
    console.error('Error starting the test:', error);
    res.status(500).json({ message: 'Error starting the test' });
  }
};

module.exports = startTest;
