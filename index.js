const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const generalRouter = require("./routers/generalRoutes");
const commonRouter = require("./routers/commonRoutes");
const userRouter = require("./routers/userRoutes");
const adminRouter = require("./routers/adminRoutes");

require("dotenv").config();

const app = express();
const db = require("./db");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Must match frontend origin
    credentials: true, // Allows cookies/auth headers
  })
);

app.get("/", (req, res) => {
  res.send("OK");
});

app.use("/", generalRouter);
app.use("/c", commonRouter);
app.use("/u", userRouter);
app.use("/a", adminRouter);
const port = process.env.PORT || 3000;

db();
app.listen(port, () => {
  console.log(`Serving on port http://localhost:${port}`);
});
