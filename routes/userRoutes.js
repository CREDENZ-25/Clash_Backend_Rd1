const express = require('express');
const router = express.Router();
const startQuizHandler = require("../controllers/StartController.js");
const authMiddleware=require("../middlewares/authMiddleware.js");
const nextButtonHandler=require("../controllers/qsController.js");
const login=require("../controllers/userController.js")

router.post('/login', login);

//start the quiz
router.post("/start-quiz",authMiddleware,startQuizHandler);



router.post('/next-button', authMiddleware, nextButtonHandler);

router.get("/leaderboard",);

router.get("/result",);

router.post("/submit",);

router.post("/lifeline1");

router.post("/lifeline2");

router.post("/lifeline3");



