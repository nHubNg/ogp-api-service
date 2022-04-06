const express = require("express");
const router = express.Router();
const {
  createNewFeed,
  getAllFeeds,
  getFeedByID,
  updateFeed,
  deleteFeed,
  commentFeed,
  likeUnlikeFeed,
} = require("../controllers/feeds_controller");
const upload = require("../configs/multer");
const auth = require("../middlewares/authVerifier");

//@Register Route POST api/v1/feed
//@description create new feed
//@access private
router.post("/", auth, createNewFeed);

// @route GET api/v1/feed
// @description get all feeds
// @access public
router.get("/", getAllFeeds);

// @route GET api/v1/feed/:feed_ID
// @description get single feed
// @access public
router.get("/:id", getFeedByID);

// @route PUT api/v1/feed/update/:feed_ID
// @description update feed
// @access private
router.put("/update/:id", auth, upload.single("feed_image"), updateFeed);

// @route DELETE api/v1/feed/delete/:feed_ID
// @description delete feed
// @access private
router.delete("/delete/:id", auth, deleteFeed);

// @route POST api/v1/feed/comment/:feed_ID
// @description comment a feed
// @access private
router.post("/comment/:id", auth, commentFeed);

// @route POST api/v1/feed/vote/:post_ID
// @description like-unlike post
// @access private
router.post("/vote/:id", auth, likeUnlikeFeed);

module.exports = router;
