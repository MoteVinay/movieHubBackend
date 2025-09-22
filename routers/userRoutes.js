const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../utils/util");

const userControls = require("../controls/user");

router.post("/:movie_id/vote", verifyJWT, userControls.vote);
router.post("/:movie_id/comment", verifyJWT, userControls.comment);
router.post("/addMovie", verifyJWT,userControls.addMovie);

module.exports = router;
