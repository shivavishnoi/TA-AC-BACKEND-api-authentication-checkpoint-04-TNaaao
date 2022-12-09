var jwt = require('jsonwebtoken');
module.exports = {
  verifyToken: async (req, res, next) => {
    var token = req.headers.authorization;
    try {
      if (token) {
        var payload = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = payload;
        return next();
      } else {
        res.status(400).json({ error: 'token needed' });
      }
    } catch (error) {
      next(error);
    }
  },
};
