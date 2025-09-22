const express = require("express");
const router = express.Router();

const adminControls = require("../controls/admin");
const commonControls = require("../controls/common");
const { verifyJWT } = require("../utils/util");

router.delete("/:movieId/delete", verifyJWT, adminControls.deleteMovie);
router.delete("/:movieId/:commentId/delete",verifyJWT, adminControls.deleteComment);
router.route("/getMovies").get(commonControls.getMovies);

module.exports = router;