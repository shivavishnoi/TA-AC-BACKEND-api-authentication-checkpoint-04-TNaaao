var express = require('express');
var router = express.Router();
var Answer = require('../modules/Answer');
const Question = require('../modules/Question');
const Comment = require('../modules/Comment');

//add answer for a question
router.post('/:questionId', async (req, res, next) => {
  req.body.author = {};
  req.body.author.authorId = req.user.userId;
  req.body.author.username = req.user.username;
  var questionId = req.params.questionId;
  req.body.questionId = questionId;
  try {
    var answer = await Answer.create(req.body);
    var updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $push: { answers: answer._id } },
      { new: true }
    );
    res.status(200).json({ answer });
  } catch (error) {
    next(error);
  }
});
//list answers for a question
router.get('/:questionId', async (req, res, next) => {
  var questionId = req.params.questionId;
  try {
    var answers = await Answer.find({ questionId });
    res.status(200).json({ answers });
  } catch (error) {
    next(error);
  }
});
//update answer
router.put('/:answerId', async (req, res, next) => {
  var answerId = req.params.answerId;
  try {
    var updatedAnswer = await Answer.findByIdAndUpdate(answerId, req.body, {
      new: true,
    });
    res.status(200).json({ updatedAnswer });
  } catch (error) {
    next(error);
  }
});
//delete answers
router.delete('/:answerId', async (req, res, next) => {
  var answerId = req.params.answerId;
  try {
    var deletedAnswer = await Answer.findByIdAndDelete(answerId);
    var updatedQuestion = await Question.findByIdAndUpdate(
      deletedAnswer.questionId,
      { $pull: { answers: answerId } },
      { new: true }
    );
    res.status(200).json(deletedAnswer);
  } catch (error) {
    next(error);
  }
});
//upvote answer
router.put('/upvote/:answerId', async (req, res, next) => {
  var answerId = req.params.answerId;
  try {
    var upvotedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { $addToSet: { upvotes: req.user.username } },
      { new: true }
    );
    res.status(200).json({ upvoted: upvotedAnswer });
  } catch (error) {
    next(error);
  }
});
//add comment
router.post('/comment/:answerId', async (req, res, next) => {
  console.log('hit');
  var answerId = req.params.answerId;
  req.body.author = {};
  req.body.author.authorId = req.user.userId;
  req.body.author.username = req.user.username;
  try {
    var comment = await Comment.create(req.body);
    var commentedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { $push: { comments: comment._id } },
      { new: true }
    );
    res.status(200).json({ comment });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
