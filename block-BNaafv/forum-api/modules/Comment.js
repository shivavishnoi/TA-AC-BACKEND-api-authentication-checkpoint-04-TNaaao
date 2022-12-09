var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  username: { type: String, required: true },
});

var commentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: authorSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
