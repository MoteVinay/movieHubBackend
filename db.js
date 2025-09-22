const mongoose = require("mongoose");
const seed = require("./seed");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(
  process.env.DB_PASSWORD
)}@reactproject.sb11ruh.mongodb.net/?retryWrites=true&w=majority&appName=${
  process.env.DB_NAME
}`;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      dbName: process.env.DB_NAME,
    });
    // await seed();
    console.log("✅ Mongoose connected to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
