import { Router } from 'express';
const router = Router();
import start from '../controllers/startcontroller.js'
import qScontroller from '../controllers/qscontroller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import login from '../controllers/logincontroller.js'
import {leaderboard} from '../controllers/leaderboardcontroller.js';
import submit from '../controllers/submit.js';
import setDoubleDipLifeline from '../controllers/qscontroller.js';

router.post('/login', login);

//start the quiz
router.get("/start",authMiddleware,start);

//next-button to submit the current mcqs answer and go to the next
router.post('/next', authMiddleware, qScontroller);

//to view user leaderboard
router.post("/leaderboard",authMiddleware,leaderboard);

//to view user result
// router.get("/result",);

router.post("/submit",authMiddleware,submit);

router.post("/",authMiddleware,);


router.post("/lifelines/DoubleDip",authMiddleware,setDoubleDipLifeline);

// router.post("/lifeline3",authMiddleware,GetMoreOrLoseMore);

export default router;