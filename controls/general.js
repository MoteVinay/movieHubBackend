const user = require("../models/User");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/util");

async function signup(req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new user({
    name: name,
    email: email,
    password_hash: hashedPassword,
    role: "user",
  });
  try {
    const savedUser = await newUser.save();
    const userInfo = {
      role: savedUser.role,
      name: savedUser.name,
      _id: savedUser._id,
    };
    const token = createToken(userInfo);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Signup in successfully",
      success: true,
      role: savedUser.role,
      name: savedUser.name,
      _id: savedUser._id,
    });
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).send(error.message);
  }
}

const notFound = async (req, res) => {
  res.status(404).json({ message: "Endpoint Not Found" });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(200)
        .json({ success: false, message: "Email and password are required." });
    }
    const User = await user.findOne({ email });
    if (!User) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect email" });
    }
    const userInfo = {
      role: User.role,
      name: User.name,
      _id: User._id,
    };
    const token = createToken(userInfo);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Logged in successfully",
      success: true,
      role: User.role,
      name: User.name,
      _id: User._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  //clear Cookie
  res.clearCookie("jwt", {
    path: "/",
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(204).json({ message: "Logged Out Successfully" });
};

const health = async (req, res) => {
  console.log("Health check OK");
  res.status(200).json({ message: "Server is healthy" });
};

const reload = async (req, res) => {
  res.json({ user: req.user });
};
module.exports = {
  login,
  logout,
  signup,
  health,
  notFound,
  reload,
};
