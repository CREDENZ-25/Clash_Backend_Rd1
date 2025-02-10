import { Router } from 'express';
import { ProgressModel } from '../config/db.js';  
import { UserModel } from '../config/db.js'; 
import dotenv from 'dotenv';
dotenv.config();
const router = Router();

router.get('/',async (req,res) => {
    const leaderboardData = await ProgressModel.findAll({
      attributes:['userid','Marks'],
      order:[['Marks','DESC']],
      include:[{
        model:UserModel,
        as:'users',
        attributes:['username'],
      }]
    })
    const leaderboard = leaderboardData.map((data) => ({
      username: data.users.username,
      marks: data.Marks,
    }));
    res.status(200).json(leaderboard);
})

export default router