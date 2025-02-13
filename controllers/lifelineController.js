const { Sequelize, DataTypes, Op } = require("sequelize");
import { MCQs } from "../config/db.js";
import { ProgressModel } from "../config/db.js";

const lifeline = async (req, res) => {
          //req.user.userid - is it expected to come from authmiddleware?
            const userid=req.user.userid;

            if (!userid) {
                return res.status(400).json({ message: "User ID not found!" });
              }

            const number=req.body;
            
            
            ldata= await ProgressModel.findOne({
                attributes:["Counter","Lifeline","Correctans","Questionsid"],
                where: {
                    userid: userid
                }
                })
            
           ldata.Lifeline[ldata.Counter]=number;

           if(number==1){
           
            
            const qid=ldata.Questionsid[ldata.Counter];

            try {
              const question = await MCQs.findOne({
                attributes:["options"],
                where: {
                    id:qid
                }
                })
            ;
              if (!question) throw new Error("Question not found");
          
              const  optionArray = question.options;
              const answerIdx = ldata.Correctans[ldata.Counter];
              const incorrectIndices = optionArray.map((_, index) => index).filter((index) => index !== answerIdx);
              const shuffledIncorrectIndices = incorrectIndices.sort(() => 0.5 - Math.random());
             console.log(shuffledIncorrectIndices);

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
              
          
              await ProgressModel.update({ Lifeline:isusedlifeline });
             
          
              return res.status(200);
            } catch (error) {
              console.error("Error using 50-50 lifeline:", error.message);
             
              throw error;
            }


           
/*

// Initialize Sequelize connection


// Function to use the 50-50 lifeline
async function use5050Lifeline(questionId, progressId) {
  const transaction = await sequelize.transaction();

  try {
    const question = await Question.findByPk(questionId, { transaction });
    if (!question) throw new Error("Question not found");

    const { optionArray, answerIdx } = question;
    const incorrectIndices = optionArray.map((_, index) => index).filter((index) => index !== answerIdx);
    const shuffledIncorrectIndices = incorrectIndices.sort(() => 0.5 - Math.random());
    const selectedIncorrectIndices = shuffledIncorrectIndices.slice(0, 2);
    const reducedOptions = [optionArray[answerIdx], optionArray[selectedIncorrectIndices[0]]];

    const progress = await Progress.findByPk(progressId, { transaction });
    if (!progress) throw new Error("Progress record not found");

    const isusedlifeline = [...progress.isusedlifeline];
    isusedlifeline[0] = true;

    await progress.update({ isusedlifeline }, { transaction });
    await transaction.commit();

    return reducedOptions;
  } catch (error) {
    console.error("Error using 50-50 lifeline:", error.message);
    await transaction.rollback();
    throw error;
  }
} */

}