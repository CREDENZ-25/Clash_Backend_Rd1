//const { Sequelize, DataTypes, Op } = require("sequelize");
import { QuestionModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";

const lifeline = async (req, res) => {
          //req.user.userid - is it expected to come from authmiddleware?
            const userid=req.user.userId;

            if (!userid) {
                return res.status(400).json({ message: "User ID not found!" });
              }

            const number = parseInt(req.body.number);
            console.log(number);

            let finalArray=[];
            
           const ldata= await ProgressModel.findOne({
                attributes:["Counter","Lifeline","Correctans","Questionsid"],
                where: {
                    userid: userid
                }
                })
            
           ldata.Lifeline[ldata.Counter]=number;

           if(number==1){
           
            
            const qid=ldata.Questionsid[ldata.Counter];

            try {
              const question = await QuestionModel.findOne({
                attributes:["options"],
                where: {
                    id:qid
                }
                })
            ;
              if (!question) throw new Error("Question not found");
          
              const optionArray = question.options;
              console.log(optionArray,"hi");
              const answerIdx = ldata.Correctans[ldata.Counter];
              const incorrectIndices = optionArray.map((_, index) => index).filter((index) => index !== answerIdx);
              const shuffledIncorrectIndices = incorrectIndices.sort(() => 0.5 - Math.random());

             const incorrectOption= shuffledIncorrectIndices[0];
             console.log(incorrectOption);
             console.log(shuffledIncorrectIndices);
             console.log(question.options[incorrectOption]);
              finalArray = [question.options[answerIdx],question.options[incorrectOption]];

            }
            catch(error){
              console.error("Error ahe ata in shuffling", error.message);
            }}
          try{
              const progress = await ProgressModel.findOne({
                attributes:["Lifeline"],
                where: {
                    userid:userid
                }
                }

              );
              if (!progress) throw new Error("Progress record not found");
          
              const isusedlifeline = [...progress.Lifeline,number];
              
              console.log(isusedlifeline);
          
              await ProgressModel.update(
                { Lifeline: isusedlifeline },
                { where: { userid: userid } }
              );
             
              if(number===1){
                return res.status(200).json(finalArray);
              }
              return res.status(200);
            } catch (error) {
              console.error("Error using 50-50 lifeline:", error.message);
             
              throw error;
            }
    

};

export default lifeline;