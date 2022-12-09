var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  username: { type: String, required: true },
});

var answerSchema = new Schema(
  {
    text: { type: String, required: true },
    author: authorSchema,
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    upvotes: { type: [String], default: [] },
    comments: { type: [Schema.Types.ObjectId], default: [], ref: 'Comment' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Answer', answerSchema);
