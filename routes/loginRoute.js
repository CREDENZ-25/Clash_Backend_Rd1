import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel, QuestionModel, ProgressModel } from '../config/db.js';
import { Sequelize } from 'sequelize';
dotenv.config();
const router = Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({
            attributes: ['password', 'userid', 'isJunior'],
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Password Hashed??
        const isPasswordValid = password === user.password;

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Password is incorrect!' });
        }

        let token;
        try {
            token = jwt.sign(
                { userId: user.userid, category: user.isJunior },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        } catch (error) {
            console.error('Error generating token:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        console.log("token =", token);
        
        try {
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });
        } catch (error) {
            console.error('Error setting cookie:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        console.log("Category : ", user.isJunior);
        
        let questions;
        try {
            questions = await QuestionModel.findAll({
                attributes: ['id', 'correct'],
                where: { isJunior: user.isJunior },
                order: [
                    Sequelize.fn('RANDOM')
                ]
            });
        } catch (error) {
            console.error('Error fetching questions:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        // Array of Question Ids and Correct Options idx 
        const questionIds = questions.map((question) => question.id);
        const correctOptions = questions.map((question) => question.correct);
        
        try {
            // Progress Table Created :)
            await ProgressModel.create({
                userid: user.userid,
                Questionsid: questionIds,
                Correctans: correctOptions,
                isJunior: user.isJunior,
                Marks: 0,
                Counter: 0,
                Selectedans: [],
            });
        } catch (error) {
            console.error('Error creating progress record:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        return res.status(200).json({ message: 'Login successful And Progress Table Updated' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
