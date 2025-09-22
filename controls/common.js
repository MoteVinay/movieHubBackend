// controllers/movieController.js (example)
const Movie = require("../models/Movie");

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      // join votes
      {
        $lookup: {
          from: "votes",                // collection name (lowercase plural of model)
          localField: "_id",
          foreignField: "movie_id",
          as: "votes",
        },
      },

      // compute upVotes and downVotes counts
      {
        $addFields: {
          upVotes: {
            $size: {
              $filter: {
                input: "$votes",
                as: "v",
                cond: { $eq: ["$$v.vote_type", true] },
              },
            },
          },
          downVotes: {
            $size: {
              $filter: {
                input: "$votes",
                as: "v",
                cond: { $eq: ["$$v.vote_type", false] },
              },
            },
          },
        },
      },

      // net votes (up - down)
      {
        $addFields: {
          totalVotes: { $subtract: ["$upVotes", "$downVotes"] },
        },
      },

      // join comments
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "movie_id",
          as: "comments",
        },
      },

      // collect distinct comment user ids (array of ObjectId)
      {
        $addFields: {
          commentUserIds: {
            $map: { input: "$comments", as: "c", in: "$$c.user_id" },
          },
        },
      },

      // lookup users that appear in comments (only name + _id)
      {
        $lookup: {
          from: "users",
          let: { userIds: "$commentUserIds" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$userIds"] } } },
            { $project: { name: 1 } }, // add fields you need from User
          ],
          as: "commentUsers",
        },
      },

      // transform comments so each comment.user_id becomes { _id: "<string>", name: "<name>" }
      // and keep other comment fields
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "c",
              in: {
                $let: {
                  vars: {
                    matchedUser: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$commentUsers",
                            as: "u",
                            cond: { $eq: ["$$u._id", "$$c.user_id"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    _id: "$$c._id",
                    body: "$$c.body",
                    created_at: "$$c.created_at",
                    // user_id becomes a small object with _id as string + name
                    user_id: {
                      _id: { $toString: "$$c.user_id" },
                      name: "$$matchedUser.name",
                    },
                  },
                },
              },
            },
          },
        },
      },

      // convert votes[].user_id to string to make client comparisons simpler
      {
        $addFields: {
          votes: {
            $map: {
              input: "$votes",
              as: "v",
              in: {
                _id: "$$v._id",
                user_id: { $toString: "$$v.user_id" },
                vote_type: "$$v.vote_type",
              },
            },
          },
        },
      },

      // cleanup helper arrays
      {
        $project: {
          commentUserIds: 0,
          commentUsers: 0,
        },
      },

      // optional: sort by creation date (newest first)
      { $sort: { created_at: -1 } },
    ]);

    return res.json({ movies });
  } catch (err) {
    console.error("Error in getMovies aggregation:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getMovies };
