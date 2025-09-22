const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movie_id: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    vote_type: {
      type: Boolean,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Vote", voteSchema);
