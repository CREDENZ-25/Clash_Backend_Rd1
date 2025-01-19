const express = require('express');
const router = express.Router();
const {question} = require('../models/question.js'); 
const addQuestion = require("../controllers/QuestionArray.js")
const startTest = require("../controllers/startTest.js")
const submitTest = require("../controllers/SubmitAnswer.js")


router.post("/startTest" , startTest);

router.post("/addQuestion",addQuestion );

router.post("/submitTest",submitTest);

module.exports = router;