import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";

const next = async (req, res) => {
  // console.log("NEXT!!!");
  const answer = req.body.answer;  
  if(answer==null){
    return res.status(500).json({error:"Error Null Value"});
  }
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found!" });
    }

    let userData;
    try {
      userData = await ProgressModel.findOne({
        attributes: ["Counter", "Questionsid", "Selectedans", "Correctans", "Marks","createdAt","Corrects","Lifeline"],
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
    const lifeline=userData.Lifeline;

    // console.log(correct_array, selected_array, question_array, counter);
    const check = correct_array[counter];
    // console.log(check);

    try {
      
    if(lifeline[counter]==1 || lifeline[counter]==2|| lifeline[counter]==3){
          if (String(check) === String(answer)) {

              await ProgressModel.update(
              { Marks: Marks + 4, Selectedans: [...selected_array, answer], Counter: counter + 1,Corrects: userData.Corrects+1 },
               { where: { userid: userId } }
        );
      } else {
        await ProgressModel.update(
          { Marks: Marks - 1, Selectedans: [...selected_array, answer], Counter: counter + 1 },
          { where: { userid: userId } }
        );
      }
      if(lifeline[counter]==2){
        if(String(check) === String(answer)){
          await ProgressModel.update(
            { Marks: Marks + 4 },
            { where: { userid: userId } }
          )
        }
        else{
          await ProgressModel.update(
            { Marks: Marks - 3 },
            { where: { userid: userId } }
          )
        }
      }
    }
      else{
          if (String(check) === String(answer)) {

              await ProgressModel.update(
              { Marks: Marks + 4, Selectedans: [...selected_array, answer], Lifelines:[...lifeline, 0],Counter: counter + 1,Corrects: userData.Corrects+1 },
               { where: { userid: userId } }
        );
      } else {
        await ProgressModel.update(
          { Marks: Marks - 1, Selectedans: [...selected_array, answer],Lifelines:[...lifeline, 0] ,Counter: counter + 1 },
          { where: { userid: userId } }
        );
      }
      
      
      }

      
      if (String(check) === String(answer)) {

        await ProgressModel.update(
          { Marks: Marks + 4, Selectedans: [...selected_array, answer], Lifelines:[...lifeline, 0],Counter: counter + 1,Corrects: userData.Corrects+1 },
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
    if (counter===3){return res.status(202).json('Questions over');}
    try {
      const qid = userData.Questionsid[counter + 1];
      question_data = await QuestionModel.findOne({
        attributes: ["questions", "options"],
        where: { id: qid },
      });

      if (!question_data) {
        return res.status(404).json({ message: "Question not found" });
      }
    } catch (error) {
      console.error("Error fetching next question:", error);
      return res.status(500).json({ message: "Error fetching next question" });
    }

    //time update Logic

    var float_time=0;
        
      const datetime = userData.createdAt; 
      console.log(datetime );
         const created= new Date(datetime).getTime();
         const updated = Date.now();

        //  console.log(created );
        //  console.log(updated);
         float_time= 1800 - ((updated)-(created))/1000 ;
         var timeleft = Math.round( float_time );
        //  console.log(timeleft);
        if (timeleft<=0){return res.status(202).json('Time over');}    
         console.log("minutes:" , Math.floor(timeleft/60));
         console.log("seconds:" , timeleft%60);

     return res.status(200).json({
            nextquestion:question_data,
            timedata:timeleft
         });



  } catch (error) {
    console.error("Error in next function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default next;
