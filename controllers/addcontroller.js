
import { QuestionModel } from "../config/db.js";
const addProblem = async (req, res) => {
    try {
        const { question, options, correct, isJunior } = req.body

        const newProblem = await QuestionModel.create({
            question, options, correct, isJunior
        })
        return res.status(200).json({ message: "Question Created Successfully", question })
    }
    catch (error) {
        console.error("Error creating problem:", error);
        return res.status(500).json({ error: "Error creating problem", details: error.message });
    }

}

export default addProblem;