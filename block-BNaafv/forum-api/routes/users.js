var express = require('express');
const User = require('../modules/User');
var auth = require('../middlewares/auth');
var router = express.Router();
//register
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    console.log(token);
    return res.status(200).json({ user: user.userJSON(token) });
  } catch (error) {
    res.status(400).json({ error });
  }
});
//login with active status user only
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password is needed' });
  }
  var user = await User.findOne({ email });
  if (!user || !user.status) {
    return res.status(400).json({ error: 'User is not Registered/blocked.' });
  }
  var result = await user.verifyPassword(password);
  if (!result) {
    return res.status(400).json({ error: 'Password Incorrect' });
  }
  var token = await user.signToken();
  res.status(200).json({ access: user.userJSON(token) });
});
//auth middleware
router.use(auth.verifyToken);
//current-user
router.get('/current_user', async (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

//dynamic routes
router.get('/profile/:username', async (req, res, next) => {
  var username = req.params.username;
  try {
    var user = await User.findOne({ username }, 'name username image bio');
    res.status(200).json({ profile: user });
  } catch (error) {
    next(error);
  }
});
router.put('/profile/:username', async (req, res, next) => {
  var username = req.params.username;
  try {
    var user = await User.findOneAndUpdate({ username }, req.body, {
      new: true,
    });
    //password not getting hash issue
    user.save();
    res.status(200).json({ updatedUser: user });
  } catch (error) {
    next(error);
  }
});
//follow users
router.put('/follow/:username', async (req, res, next) => {
  var username = req.params.username;
  var currentUser = req.user.username;
  try {
    var otherUserFollowed = await User.findOneAndUpdate(
      { username },
      { $addToSet: { followers: currentUser } },
      { new: true }
    );
    var currentUserFollowing = await User.findOneAndUpdate(
      { username: currentUser },
      { $addToSet: { following: username } },
      { new: true }
    );
    res.status(200).json({ updated: currentUserFollowing });
  } catch (error) {
    next(error);
  }
});
//admin block users
router.put('/block/:userId', async (req, res, next) => {
  var userId = req.params.userId;
  try {
    var loggedUser = await User.findById(req.user.userId);
    if (loggedUser.admin) {
      var blockedUser = await User.findOneAndUpdate(
        userId,
        { status: false },
        { new: true }
      );
      return res.status(200).json({ blockedUser });
    } else {
      return res.status(400).json({ error: 'Login With Admin Account' });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
