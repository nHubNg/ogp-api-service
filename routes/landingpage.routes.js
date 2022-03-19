const router = require("express").Router()


// @route GET /
// @description landing page route
// @access public
router.get("/", (req, res) => {
	res.sendFile("../landingPage.html", { root: __dirname });
});

module.exports = router;
