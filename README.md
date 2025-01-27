
Working of the System

1.Fetching Questions and Options

When the user starts the test, the system fetches the list of questions based on the question_array stored in the Progress table for the user.
The Questions table will fetch all the questions .
2.Timer Initialization
When the user presses the "Start" button, the timer begins, and the start time is recorded in the Progress table.

3.Question Navigation
what we are selecting all the questions on the basis of array created in the progress table, converting them in json ane sending to frontend , them frontend will fetch and show to the user and add the question id and the selected option of the user and then convert them in object and return

4.Automatic Submission
If the time limit is reached the test is automatically submitted,and the system evaluates the answers provided by the user up to that point. The correct_answers_count is updated accordingly
