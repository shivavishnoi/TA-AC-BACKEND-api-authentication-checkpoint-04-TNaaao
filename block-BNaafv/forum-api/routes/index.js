var express = require('express');
var router = express.Router();
var Question = require('../modules/Question');
/* GET home page. */
router.get('/tags', async function (req, res, next) {
  try {
    var tags = await Question.distinct('tags');
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
