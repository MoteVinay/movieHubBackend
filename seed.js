const mongoose = require("mongoose");
const User = require("./models/User");
const Movie = require("./models/Movie");
const Vote = require("./models/Vote");
const Comment = require("./models/Comment");
const bcrypt = require("bcrypt");

async function seed() {
  try {
    // Clear old data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Vote.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data");

    // Hash passwords
    passwords = ["Alice@user1", "Charlie@user1", "Bob@admin1"];
    hashedP = [];
    for (let pass of passwords) {
        const hashed = await bcrypt.hash(pass, 10);
        hashedP.push(hashed);
    }

    // Users
    const users = await User.insertMany([
      {
        name: "Alice",
        email: "alice@example.com",
        password_hash: hashedP[0],
        role: "user",
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password_hash: hashedP[1],
        role: "user",
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password_hash: hashedP[2],
        role: "admin",
      },
    ]);
    console.log(
      "Inserted Users:",
      users.map((u) => u.name)
    );

    // Movies
    const movies = await Movie.insertMany([
      {
        title: "The Matrix",
        description: "A hacker discovers reality is a simulation.",
        added_by: users[1]._id,
      },
      {
        title: "Inception",
        description: "A mind-bending thriller by Christopher Nolan.",
        added_by: users[0]._id,
      },
    ]);
    console.log(
      "Inserted Movies:",
      movies.map((m) => m.title)
    );

    // Votes (1 vote by Alice on Inception)
    const votes = await Vote.insertMany([
      { user_id: users[0]._id, movie_id: movies[0]._id, vote_type: true },
    ]);
    console.log("Inserted Votes:", votes.length);

    // Comments
    const comments = await Comment.insertMany([
      {
        user_id: users[0]._id,
        movie_id: movies[0]._id,
        body: "Amazing movie! Loved the concept.",
      },
      {
        user_id: users[1]._id,
        movie_id: movies[1]._id,
        body: "One of my all-time favorite sci-fi films.",
      },
      {
        user_id: users[2]._id,
        movie_id: movies[0]._id,
        body: "Inception is a masterpiece.",
      },
      {
        user_id: users[1]._id,
        movie_id: movies[0]._id,
        body: "Mind-bending visuals and story!",
      },
    ]);
    console.log("Inserted Comments:", comments.length);

    console.log("🌱 Seeding complete!");
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

module.exports = seed;
