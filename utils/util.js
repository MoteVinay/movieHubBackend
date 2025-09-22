require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = (obj) => {
  return jwt.sign(
    { role: obj.role, name: obj.name, _id: obj._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "59m",
    }
  );
};

const getRole = () => {};

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // console.log("Decoded JWT:", decoded);
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
};

module.exports = { createToken, getRole, verifyJWT };
