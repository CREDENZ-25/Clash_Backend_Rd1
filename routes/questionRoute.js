const express = require('express');
const router = express.Router();
const addQuestion = require("../controllers/ArrayController.js")
const startTest = require("../controllers/StartController.js")
// const submitTest = require("../controllers/SubmitAnswer.js")


router.post("/startTest" , startTest);

router.post("/addQuestion",addQuestion );

// router.post("/submitTest",submitTest);

module.exports = router;
