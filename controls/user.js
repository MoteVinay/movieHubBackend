const Movie = require("../models/Movie");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");

const comment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const userId = req.user._id;
    const { body } = req.body;
    const { movie_id: movieId } = req.params;

    if (!movieId || !body?.trim()) {
      return res.status(400).json({ error: "movieId and body are required" });
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { user_id: userId, movie_id: movieId },
      { body }, 
      { new: true, upsert: true, setDefaultsOnInsert: true } 
    );

    const movie = await Movie.findById(movieId).lean();
    const comments = await Comment.find({ movie_id: movieId })
      .populate("user_id", "name")
      .lean();

    const votes = await Vote.find({ movie_id: movieId }).lean();
    const upVotes = votes.filter((v) => v.vote_type === true).length;
    const downVotes = votes.filter((v) => v.vote_type === false).length;
    const totalVotes = upVotes + downVotes;

    res.status(200).json({
      message: "Comment recorded successfully",
      comment: updatedComment,
      movie: {
        ...movie,
        comments,
        votes,
        upVotes,
        downVotes,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Error adding/updating comment", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const vote = async (req, res) => {
  console.log("in vote controller");
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const userId = req.user._id;
    const { voteType } = req.body;
    const { movie_id: movieId } = req.params;

    if (!movieId || voteType == null) {
      return res
        .status(400)
        .json({ error: "movieId and voteType are required" });
    }

    const updatedVote = await Vote.findOneAndUpdate(
      { user_id: userId, movie_id: movieId }, 
      { vote_type: voteType },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const movie = await Movie.findById(movieId).lean();
    const votes = await Vote.find({ movie_id: movieId }).lean();

    const upVotes = votes.filter((v) => v.vote_type === true).length;
    const downVotes = votes.filter((v) => v.vote_type === false).length;
    const totalVotes = upVotes + downVotes;

    res.status(200).json({
      message: "Vote recorded successfully",
      vote: updatedVote,
      movie: {
        ...movie,
        votes,
        upVotes,
        downVotes,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Error recording vote", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addMovie = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const userId = req.user._id;
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const newMovie = new Movie({
      title: title.trim(),
      description: description.trim(),
      added_by: userId,
    });

    const savedMovie = await newMovie.save();

    res
      .status(201)
      .json({ message: "Movie added successfully", movie: savedMovie });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { comment, vote, addMovie };
