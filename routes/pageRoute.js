const express = require("express");
const { getIndexPage } = require("../controllers/pageController");

const router = express.Router();

router.route("/").get(getIndexPage);

module.exports = router;
