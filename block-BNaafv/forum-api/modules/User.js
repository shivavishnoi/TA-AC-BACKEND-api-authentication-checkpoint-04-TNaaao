var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    image: { type: String },
    bio: { type: String },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    admin: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified && this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    console.log(result);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.signToken = async function () {
  var payload = {
    email: this.email,
    userId: this.id,
    username: this.username,
  };
  try {
    var token = await jwt.sign(payload, process.env.TOKEN_SECRET);
    // console.log(token, process.env.TOKEN_SECRET, payload);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    email: this.email,
    username: this.username,
    userId: this.id,
    token: token,
  };
};
module.exports = mongoose.model('User', userSchema);
