import { Router } from 'express';
const router = Router();
import start from '../controllers/startcontroller.js'
import qScontroller from '../controllers/qscontroller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import login from '../controllers/logincontroller.js'
import {leaderboard} from '../controllers/leaderboardcontroller.js';
import submit from '../controllers/submit.js'
import  use5050Lifeline from "../controllers/Life50-50Controller.js";
import {toggleuseGamble} from '../controllers/gambleController.js'
import {togglesetDoubleDip} from '../controllers/DoubleDipController.js'
import addProblem from '../controllers/addcontroller.js';

// import GetMoreOrLoseMore from "../controllers/LifeGetmoreController.js";
router.post('/login', login);

//start the quiz
router.post("/start",authMiddleware,start);

//next-button to submit the current mcqs answer and go to the next
router.post('/next', authMiddleware, qScontroller);

//to view user leaderboard
router.get("/leaderboard", authMiddleware, leaderboard);

//to view user result
// router.get("/result",);

router.post("/submit", authMiddleware, submit);

router.post("/", authMiddleware,);

router.post("/lifeline1",authMiddleware,togglesetDoubleDip);

router.post("/lifeline2",authMiddleware,use5050Lifeline);

router.post("/lifeline3",authMiddleware,toggleuseGamble);
router.post("/AddProblemAkanksha",authMiddleware, addProblem )

export default router;
