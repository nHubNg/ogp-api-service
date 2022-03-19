const router = require("express").Router();
const path = require("path");

// @route GET /
// @description landing page route
// @access public
router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "../landingPage.html"));
});

module.exports = router;
