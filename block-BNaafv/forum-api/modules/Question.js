var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slugify');

var authorSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  username: { type: String, required: true },
});
var questionSchema = new Schema(
  {
    tags: { type: [String], default: [] },
    //add answer ref
    answers: { type: [Schema.Types.ObjectId], default: [], ref: 'Answer' },
    title: { type: String, required: true },
    description: { type: String },
    slug: { type: String }, //make required but then slugify don't work then
    author: authorSchema,
  },
  {
    timestamps: true,
  }
);
questionSchema.pre('save', async function (next) {
  try {
    this.slug = await slugify(this.title, {
      replacement: '_',
      lower: true,
      trim: true,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('Question', questionSchema);
