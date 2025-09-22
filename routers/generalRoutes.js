const express = require("express");
const router = express.Router();

const generalControls = require("../controls/general");
const { verifyJWT } = require("../utils/util");

// general routes
router.get("/me", verifyJWT, generalControls.reload);
router.route("/login").post(generalControls.login);
router.route("/signup").post(generalControls.signup);
router.route("/logout").post(generalControls.logout);
router.route("/health").get(generalControls.health);

module.exports = router;