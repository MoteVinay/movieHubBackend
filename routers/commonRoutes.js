const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../utils/util");


const commonControls = require("../controls/common");

router.get("/getMovies", verifyJWT, commonControls.getMovies);

module.exports = router;