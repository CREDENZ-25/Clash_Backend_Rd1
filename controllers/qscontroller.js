import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";
import { useGamble } from "./gambleController.js";
import use5050Lifeline from "../controllers/Life50-50Controller.js"

const next = async (req, res) => {
  // console.log("NEXT!!!");
  const answer = req.body.answer;
  if (answer == null) {
    return res.status(500).json({ error: "Error Null Value" });
  }
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found!" });
    }

    let userData;
    try {
      userData = await ProgressModel.findOne({

        // attributes: ["Counter", "Questionsid", "Selectedans", "Correctans", "Marks","createdAt","Corrects","isUsedGamble"],

        where: {
          userid: userId,
        },
        
      });
  
      
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return res.status(500).json({ message: "Error fetching user progress" });
    }

    const correct_array = userData.Correctans;
    const selected_array = userData.Selectedans;
    const question_array = userData.Questionsid;
    const counter = userData.Counter;
    let Marks = userData.Marks;

    // console.log(correct_array, selected_array, question_array, counter);
    const check = correct_array[counter];
    // console.log(check);

    try {

      if(userData.isUsed5050){
        userData.isUsed5050=false;
        await use5050Lifeline(req,res);
      }
      else if (userData.isUsedGamble) {
        userData.isUsedGamble=false; 
        console.log("Gambling");
        Marks = await useGamble(userId, check, answer);
      } 
      
      else if (userData.isUsedDoubleDip) {
        userData.isUsedDoubleDip=false;
        console.log("isused double dip",userData.isUsedDoubleDip);

        console.log("check",check);
        console.log('answer',answer);


        let isFirstGuessCorrect =check ===answer ;
        
        console.log("is correct",isFirstGuessCorrect)

        if (isFirstGuessCorrect) {
          const new_pg = await ProgressModel.update(
            { Marks: Marks + 4, 
              isUsedDoubleDip: false,
              Selectedans: [...selected_array, answer],
              Counter:counter+1
            },
            { where: { userid: userId } }
          );

          console.log("prgress modle1",new_pg)
          console.log("Opps Lifeline wasted you were right ");
          // return res.json({ success: true, message: "Correct answer!" });
        } else {
            const new_pg = await ProgressModel.update(
                { isUsedDoubleDip: false },
                { where: { userid: userId } }
              );

              console.log("pg2",new_pg)

          return res.json({ success: false, message: "First guess was wrong. You have one more chance!" });
        }
      }
      
      else if (String(check) === String(answer)) {
        console.log("Correct!!!");
        await ProgressModel.update(
          {
            Marks: Marks + 4,
            Selectedans: [...selected_array, answer],
            Counter: counter + 1,
            Corrects: userData.Corrects + 1,
          },
          { where: { userid: userId } },

          (Marks = Marks + 4)
        );



        // console.log("new pg3",pg)
      } else {
        console.log("Wrong!!!");
        await ProgressModel.update(
          {
            Marks: Marks - 1,
            Selectedans: [...selected_array, answer],
            Counter: counter + 1,
          },
          { where: { userid: userId } },

          (Marks = Marks - 1)
        );

        
      }
    } catch (error) {
      console.error("Unable to update progress:", error);
      return res.status(500).json({ message: "Error updating progress" });
    }

    let question_data;
    let marksData;

    if (counter+1 >= question_array.length) {
      return res.status(202).json({status:202,message:"Questions over"});
    }
    let optionsObject = null;
    try {
      const qid = userData.Questionsid[counter + 1];
      question_data = await QuestionModel.findOne({
        attributes: ["question", "options"], //0 :new york

        where: { id: qid },
      });

      optionsObject = {
        0: question_data.options[0],
        1: question_data.options[1],
        2: question_data.options[2],
        3: question_data.options[3],
      };
      
    } catch (error) {
      console.error("Error fetching next question:", error);
      return res.status(500).json({ message: "Error fetching next question" });
    }

    //time update Logic


    var float_time = 0;

    const datetime = userData.createdAt;
    console.log(datetime);
    const created = new Date(datetime).getTime();
    const updated = Date.now();

    //  console.log(created );
    //  console.log(updated);
    //time retrived in milli seconds so divid by 1000
    float_time = 1800 - (updated - created) / 1000;
    var timeleft = Math.round(float_time);
    //  console.log(timeleft);
    if (timeleft <= 0) {
      return res.status(404).json("Time over");
    }
    console.log("minutes:", Math.floor(timeleft / 60));
    console.log("seconds:", timeleft % 60);


    const lifelinestatus = {
      0:userData.isUsedDoubleDip,
      1:userData.isUsed5050,
      2:userData.isUsedGamble
    }
    console.log(lifelinestatus);

    return res.status(200).json({
      question: question_data.question,
      optionsObject: optionsObject,
      timeleft: timeleft,
      Marks: Marks,
      lifeline : lifelinestatus

    });
  } catch (error) {
    console.error("Error in next function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default next;
