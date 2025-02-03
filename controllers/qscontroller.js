import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";

const next = async (req, res) => {
  console.log("NEXT!!!");
  const answer = req.body.answer;

  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found!" });
    }

    let userData;
    try {
      userData = await ProgressModel.findOne({
        attributes: ["Counter", "Questionsid", "Selectedans", "Correctans", "Marks"],
        where: {
          userid: userId,
        },
      });

      if (!userData) {
        return res.status(404).json({ message: "User progress not found!" });
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return res.status(500).json({ message: "Error fetching user progress" });
    }

    const correct_array = userData.Correctans;
    const selected_array = userData.Selectedans;
    const question_array = userData.Questionsid;
    const counter = userData.Counter;
    const Marks = userData.Marks;

    console.log(correct_array, selected_array, question_array, counter);
    const check = correct_array[counter];
    console.log(check);

    try {
      if (check === answer) {
        await ProgressModel.update(
          { Marks: Marks + 4, Selectedans: [...selected_array, answer], Counter: counter + 1 },
          { where: { userid: userId } }
        );
      } else {
        await ProgressModel.update(
          { Marks: Marks - 1, Selectedans: [...selected_array, answer], Counter: counter + 1 },
          { where: { userid: userId } }
        );
      }
    } catch (error) {
      console.error("Unable to update progress:", error);
      return res.status(500).json({ message: "Error updating progress" });
    }

    let question_data;
    try {
      const qid = userData.Questionsid[counter + 1];
      question_data = await QuestionModel.findOne({
        attributes: ["question", "options"],
        where: { id: qid },
      });

      if (!question_data) {
        return res.status(404).json({ message: "Question not found" });
      }
    } catch (error) {
      console.error("Error fetching next question:", error);
      return res.status(500).json({ message: "Error fetching next question" });
    }

    return res.status(200).json({ question_data });
  } catch (error) {
    console.error("Error in next function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default next;
