var express = require('express');
var router = express.Router();
var Question = require('../modules/Question');

//create question
router.post('/', async (req, res, next) => {
  req.body.author = {};
  req.body.author.authorId = req.user.userId;
  req.body.author.username = req.user.username;
  try {
    var question = await Question.create(req.body);
    res.status(200).json({ question });
  } catch (error) {
    next(error);
  }
});
//list all questions
router.get('/', async (req, res, next) => {
  try {
    var questions = await Question.find({});
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
});
//dynamic routers with ":"
//update
router.put('/:questionId', async (req, res, next) => {
  var questionId = req.params.questionId;
  try {
    var updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ updatedQuestion });
  } catch (error) {
    next(error);
  }
});
//delete question
router.delete('/:slug', async (req, res, next) => {
  var slug = req.params.slug;
  try {
    var deletedQuestion = await Question.findOneAndDelete({ slug });
    res.status(200).json({ deletedQuestion });
  } catch (error) {
    next(error);
  }
});
//list single question with answers populated
router.get('/:questionId', async (req, res, next) => {
  var questionId = req.params.questionId;
  try {
    var question = await Question.findById(questionId).populate('answers');
    res.status(200).json({ question });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
