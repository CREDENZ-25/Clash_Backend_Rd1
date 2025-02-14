import MCQ from '../models/mcq';
import Progress from '../models/progress';
import User from '../models/User';
import express from "express";
import cookieParser from 'cookie-parser';

app.use(cookieParser());

const nextButtonHandler = async (req, res) => {
    const { answer } = req.body;  
    try {
        const user = req.user;  
        const final_counter = await fetchCounterByUser(user);
        const final_qarray = await fetchQuestionByUser(user);
        const selected_ans = await fetchAnswerByUser(user);
        const correct_ans = await fetchCorrectAnsByUser(user);
        const isUsedLifelines = await fetchUsedLifelines(user);
        const userMarks = await fetchUserMarks(user);

        const check = final_counter - 1;
        const currentQuestionId = final_qarray[check];

        // Save user's selected answer
        selected_ans[check] = answer;
        await Progress.update(
            { Selectedans: selected_ans },
            { where: { userid: user.id } }
        );

        // Check if the lifeline was used for this question
        const lifelineUsed = isUsedLifelines.includes(currentQuestionId);

        if (!lifelineUsed) {  
            let updatedMarks = userMarks;
            updatedMarks += (answer === correct_ans[check]) ? 4 : -1;

            await Progress.update({ Marks: updatedMarks }, { where: { userid: user.id } });
        }

        // Move to next question
        const updatedCounter = final_counter + 1;
        await Progress.update({ counter: updatedCounter }, { where: { userid: user.id } });

        // Fetch next question
        const nextQuestionId = final_qarray[updatedCounter];
        const nextQuestion = await MCQ.findOne({ attributes: ['questions', 'options'], where: { id: nextQuestionId } });

        if (!nextQuestion) return res.status(404).json({ message: "Next question not found" });

        res.status(200).json({ question_data: nextQuestion });
    } catch (error) {
        console.error("Error in nextButtonHandler:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch user progress counter
async function fetchCounterByUser(user) {
    try {
        const progress = await Progress.findOne({ attributes: ['counter'], where: { userid: user.id } });

        if (progress) {
            const updatedCounter = progress.counter + 1;
            await Progress.update({ counter: updatedCounter }, { where: { userid: user.id } });
            return updatedCounter;
        }
    } catch (error) {
        console.error('Error getting counter:', error);
        throw error;
    }
}

// Fetch list of question IDs
async function fetchQuestionByUser(user) {
    try {
        const progress = await Progress.findOne({ attributes: ['Questionsid'], where: { userid: user.id } });
        return progress ? progress.Questionsid : [];
    } catch (error) {
        console.error('Error getting questions:', error);
        throw error;
    }
}

// Fetch user's selected answers
async function fetchAnswerByUser(user) {
    try {
        const progress = await Progress.findOne({ attributes: ['Selectedans'], where: { userid: user.id } });
        return progress ? progress.Selectedans : [];
    } catch (error) {
        console.error('Error getting selected answers:', error);
        throw error;
    }
}

// Fetch correct answers
async function fetchCorrectAnsByUser(user) {
    try {
        const progress = await Progress.findOne({ attributes: ['Correctans'], where: { userid: user.id } });
        return progress ? progress.Correctans : [];
    } catch (error) {
        console.error('Error getting correct answers:', error);
        throw error;
    }
}

// Fetch isUsedLifelines array
async function fetchUsedLifelines(user) {
    try {
        const progress = await Progress.findOne({ attributes: ['isUsedLifelines'], where: { userid: user.id } });
        return progress ? progress.isUsedLifelines : [-1, -1, -1];
    } catch (error) {
        console.error('Error getting used lifelines:', error);
        throw error;
    }
}

// Fetch user's marks
async function fetchUserMarks(user) {
    try {
        const progress = await Progress.findOne({ attributes: ['Marks'], where: { userid: user.id } });
        return progress ? progress.Marks : 0;
    } catch (error) {
        console.error('Error getting user marks:', error);
        throw error;
    }
}

module.exports = {
    fetchCounterByUser,
    fetchQuestionByUser,
    fetchAnswerByUser,
    fetchCorrectAnsByUser,
    fetchUsedLifelines,
    fetchUserMarks,
    nextButtonHandler
};
