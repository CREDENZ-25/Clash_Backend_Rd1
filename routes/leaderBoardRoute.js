import { Router } from 'express';
import { ProgressModel } from '../config/db.js';  
import { UserModel } from '../config/db.js'; 
import dotenv from 'dotenv';
dotenv.config();
const router = Router();

router.post('/', async (req, res) => {
    try {
        const { userId, isJunior } = req.user || {}; 

        const leaderboardData = await ProgressModel.findAll({
            attributes: ['userid', 'Marks', 'isJunior','Counter'],
            order: [['Marks', 'DESC']],
            include: [{
                model: UserModel,
                as: 'users',
                attributes: ['username'],
            }]
        });

        //Junior and Senior Seperate Array
        let juniorLeaderboard = [];
        let seniorLeaderboard = [];

        let juniorRank = 0, seniorRank = 0;
        let prevJuniorMarks = null, prevSeniorMarks = null;
        let userRank = null;

        leaderboardData.forEach((data) => {
            if (data.isJunior) {
                // Rank logic for juniors
                juniorRank = (prevJuniorMarks !== data.Marks) ? 
                juniorRank + 1 : juniorRank;
                prevJuniorMarks = data.Marks;
                juniorLeaderboard.push({
                    rank: juniorRank,
                    questionSolved : data.Counter,
                    username: data.users.username,
                    marks: data.Marks
                });

                if (userId && data.userid === userId && isJunior) {
                    userRank = juniorRank;
                }

            } else {
                // Rank logic for seniors
                seniorRank = (prevSeniorMarks !== data.Marks) ? seniorRank + 1 : seniorRank;
                prevSeniorMarks = data.Marks;
                seniorLeaderboard.push({
                    rank: seniorRank,
                    questionSolved : data.Counter,
                    username: data.users.username,
                    marks: data.Marks
                });

                if (userId && data.userid === userId && !isJunior) {
                    userRank = seniorRank;
                }
            }
        });

        return res.status(200).json({
            juniorLeaderboard,
            seniorLeaderboard,
            userRank: userId ? userRank : null 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;