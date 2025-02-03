const express = require('express');
const router = express.Router();
const startQuizHandler = require("../controllers/StartController.js");
const authMiddleware=require("../middlewares/authMiddleware.js");
const nextButtonHandler=require("../controllers/qsController.js");
const login=require("../controllers/userController.js")


router.post('/login', login);

//start the quiz
router.post("/start-quiz",authMiddleware,startQuizHandler);

//next-button to submit the current mcqs answer and go to the next
router.post('/next', authMiddleware, nextButtonHandler);

//to view user leaderboard
router.get("/leaderboard",);

//to view user result
router.get("/result",);

router.post("/submit",);

router.post("/lifeline1",authMiddleware,);

router.post("/lifeline2",authMiddleware,);

router.post("/lifeline3",authMiddleware,);



