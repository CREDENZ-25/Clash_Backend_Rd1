// Gamble

import {ProgressModel} from "../config/db.js";

const toggleuseGamble = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const progress  = await ProgressModel.findOne({
      attributes: ["isUsedGamble"],
      where: {
        userid: userId,
      },
    });

    console.log(progress);

    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    
    if(progress.isUsedGamble==false){
      return res.status(400).json({message:"Gamble is Already used"})
    }

    await ProgressModel.update(
      { isUsedGamble: true },  
      { where: { userid: userId } } 
    );
    
    // console.log("User gamble set to true");

    return res.status(200).json({ message: "Gamble status updated" });
    
  } catch (error) {
    console.error("Gamble Error:", error.message);
    return res.status(400).json({ error: "Gamble Error" });
  }
};

// Function to implement the GetMoreOrLoseMore lifeline
const useGamble = async (userid, correctAnswerIndex, userAnswerIndex) => {
  try {
    const isCorrect = String(userAnswerIndex) === String(correctAnswerIndex);
    const scoreChange = isCorrect ? 8 : -4;
    console.log("Score change  : ",scoreChange);
    const progress = await ProgressModel.findOne({
      where: { userid: userid },
    });

    if (!progress) throw new Error("Progress record not found");
    console.log("Initial Marks : ",progress.Marks)
    const updatedScore = progress.Marks + scoreChange;
    console.log("Update Marks : ",updatedScore);

    await ProgressModel.update(
      { Marks: updatedScore, 
        isUsedGamble: false ,
        Counter:progress.Counter+1,
        Selectedans: [...progress.Selectedans,userAnswerIndex],
      },  // Fields to update
      { where: { userid: userid } }  // Condition
    );
    
    return updatedScore;
    console.log("Gambled!!");
  } catch (error) {
    console.error("Error using GetMoreOrLoseMore lifeline:", error.message);
    throw error;
  }
};

export { toggleuseGamble, useGamble };
