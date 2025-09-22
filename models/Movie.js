const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    added_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

movieSchema.pre("remove", async function (next) {
  const movieId = this._id;

  try {
    await mongoose.model("Comment").deleteMany({ movie_id: movieId });
    await mongoose.model("Vote").deleteMany({ movie_id: movieId });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Movie", movieSchema);
