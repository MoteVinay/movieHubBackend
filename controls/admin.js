const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const Movie = require("../models/Movie");

const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    await Comment.deleteMany({ movie_id: movieId });
    await Vote.deleteMany({ movie_id: movieId });
    await Movie.findByIdAndDelete(movieId);
    res.status(200).json({ message: "Movie, comments, and votes deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { movieId, commentId } = req.params;
    const comment = await Comment.findOne({
      _id: commentId,
      movie_id: movieId,
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    await Comment.deleteOne({ _id: commentId });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { deleteMovie, deleteComment };
