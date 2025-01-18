
Working of the System

1.Fetching Questions and Options

When the user starts the test, the system fetches the list of questions based on the question_array stored in the Progress table for the user.
The Questions table is connected to the Options table through a one-to-many relationship, so the corresponding options for each question are also fetched automatically.

2.Timer Initialization
When the user presses the "Start" button, the timer begins, and the start time is recorded in the Progress table.

3.Question Navigation
The first question is displayed to the user. After the user submits their answer, the system fetches the next question according to the question_array in the Progress table.
This process continues for each question until either time limit is reached.

Automatic Submission
If the time limit is reached the test is automatically submitted,and the system evaluates the answers provided by the user up to that point. The correct_answers_count is updated accordingly
