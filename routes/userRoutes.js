import { Router } from 'express';
const router = Router();
import start from '../controllers/startcontroller.js'
import qScontroller from '../controllers/qscontroller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import login from '../controllers/logincontroller.js'
import { leaderboard } from '../controllers/leaderboardcontroller.js';
import submit from '../controllers/submit.js';
import lifelineController from "../controllers/Life50-50Controller.js"; // Import correctly
import addProblem from '../controllers/addcontroller.js';
router.post('/login', login);

//start the quiz
router.get("/start", authMiddleware, start);

//next-button to submit the current mcqs answer and go to the next
router.post('/next', authMiddleware, qScontroller);

//to view user leaderboard
router.post("/leaderboard", authMiddleware, leaderboard);

//to view user result
// router.get("/result",);

router.post("/submit", authMiddleware, submit);

router.post("/", authMiddleware,);

router.post("/lifeline2", authMiddleware, lifelineController.use5050Lifeline);
router.post("/lifeline3", authMiddleware, lifelineController.setDoubleDipLifeline);

router.post("/AddProblemAkanksha",authMiddleware, addProblem )

export default router;
