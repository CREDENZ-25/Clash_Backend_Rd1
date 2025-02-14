import { Router } from 'express';
const router = Router();
import start from '../controllers/startcontroller.js'
import qscontroller from '../controllers/qscontroller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import login from '../controllers/logincontroller.js'
import leaderboard from '../controllers/leaderboardcontroller.js';


router.post('/login', login);

//start the quiz
router.post("/start-quiz",authMiddleware,start);

//next-button to submit the current mcqs answer and go to the next
router.post('/next', authMiddleware, qscontroller);

//to view user leaderboard
router.get("/leaderboard",authMiddleware,leaderboard);

//to view user result
router.get("/result",);

router.post("/submit",);

router.post("/",authMiddleware,);

// router.post("/lifeline2",authMiddleware,use5050Lifeline);

// router.post("/lifeline3",authMiddleware,GetMoreOrLoseMore);

export default router;