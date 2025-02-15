const express = require('express');
const router = express.Router();
const {question} = require('../models/question.js'); 
const addQuestion = require("../controllers/ArrayController.js")
const startTest = require("../controllers/startcontroller.js")
// const submitTest = require("../controllers/SubmitAnswer.js")


router.post("/startTest" , startTest);

router.post("/addQuestion",addQuestion );

// router.post("/submitTest",submitTest);

module.exports = router;
