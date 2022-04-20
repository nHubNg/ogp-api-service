const { Feed } = require("../models/feeds");
const { Comment } = require("../models/comment");
const assert = require("assert");
const cloudinary = require("cloudinary").v2;
const cloudinarySetup = require("../configs/cloudinary");
const validateFeedData = require("../validation/feeds");
const validateCommentData = require("../validation/comment");
const isValidObjectId = require("../validation/objectId");
const {
	feedVotes,
	feedsVotesByGender,
} = require("../controllers/analytics_controller");
// const path = require("path");

// cloudinary upload method
const cloudinaryMediaUpload = async (file, folder) => {
	await cloudinarySetup();
	return new Promise((resolve) => {
		cloudinary.uploader.upload(
			file,
			{
				resource_type: "auto",
				folder: folder,
			},
			(err, result) => {
				if (err) return res.status(500).send("Files uplaod error");
				resolve({
					url: result.secure_url,
					id: result.public_id,
				});
			}
		);
	});
};

//:::::::::::::::::::::create new feed::::::::::::::::::::::::::
const createNewFeed = async (req, res) => {
	console.log("Here", req.body);
	try {
		const { errors, isValid } = validateFeedData(req.body);
		if (!isValid) {
			return res.status(400).json({
				success: false,
				msg: "check your feed data and try again",
				errors,
			});
		}
		const { feed_title, feed_description, tag, feed_media } = req.body;

		// check for media availability
		const newFeed = new Feed({
			feed_title,
			feed_description,
			tag,
			feed_media,
			likeCount: 0,
			unLikeCount: 0,
			user: req.user._id,
		});

		// validate tag before proceeding
		let error = newFeed.validateSync();
		// console.log(error);
		if (error) {
			assert.equal(
				error.errors["tag"].message,
				`${tag} is not a valid tag type`
			);
		} else {
			// console.log("new Feed With Media:::", newFeed);
			if (!newFeed)
				return res
					.status(500)
					.json({ success: false, msg: "Problem creating feed" });
			await newFeed.save();

			return res.status(201).json({
				success: true,
				msg: "Feed created successfully",
				newFeed,
			});
		}
	} catch (error) {
		return res.status(403).json({
			msg: "Feed creation failed",
			error: error.expected ? error.expected : error.message,
		});
	}
};

//:::::::::::::::::::Get all feed::::::::::::::::::::::::::
const getAllFeeds = async (req, res) => {
	Feed.find({ isActive: true })
		.populate("comments", ["comment_description", "user_name", "date"])
		.sort({ date: -1 })
		.then((feeds) => {
			feeds.forEach((feed) => {
				feed.likeCount =
					feed.likes.length > 0 ? feed.likes.length : feed.likeCount;
				feed.unLikeCount =
					feed.unLikes.length > 0 ? feed.unLikes.length : feed.unLikeCount;
			});
			res.status(200).json({
				data: feeds,
			});
		})
		.catch((err) =>
			res.status(404).json({ msg: "No feeds available at this time" })
		);
};

//:::::::::::::::Get single feed by ID::::::::::::::::::::
const getFeedByID = async (req, res) => {
	if (!isValidObjectId(req.params.id)) {
		res.json({ msg: "invalid feed Id" });
	} else {
		// console.log("feedID:::", req.params.id);
		try {
			let foundFeed = await Feed.findById(req.params.id).populate("comments", [
				"comment_description",
				"user_name",
				"date",
			]);
			if (!foundFeed)
				return res.status(404).json({ msg: "No feed with this ID" });
			else {
				// console.log("foundFeed:::", foundFeed);
				feedVotes(foundFeed._id).then((votes) => {
					console.log(votes);
					return res.status(200).json({
						likes: votes[0],
						male_like: votes[1],
						female_like: votes[2],
						un_likes: votes[3],
						male_unlike: votes[4],
						female_unlike: votes[5],
						data: foundFeed,
					});
				});
			}
		} catch (err) {
			res.status(404).json({ msg: "No feed with this ID...", err });
		}
	}
};

//::::::::::::::::::::Update feed::::::::::::::::::
const updateFeed = async (req, res) => {
	await Feed.findById(req.params.id).then(async (feed) => {
		if (feed) {
			try {
				if (req.file) {
					console.log("file:::", req.file);
					await cloudinarySetup();
					await cloudinary.uploader.destroy(feed.feed_image_id);
					const feedImage = await cloudinary.uploader.upload(req.file.path, {
						resource_type: "auto",
					});
					if (!feedImage)
						return res.status(500).json({ msg: "Problem uploading image" });
					else {
						let updates = {
							...req.body,
							feed_image: feedImage.secure_url || feed.feed_image,
							feed_image_id: feedImage.public_id || feed.feed_image_id,
						};
						console.log("updates with image ==>", updates);
						await Feed.findByIdAndUpdate(req.params.id, updates, {
							new: true,
						})
							.then((updated_feed) => {
								res.status(201).json({
									msg: "feed updated successfully",
									updated_feed,
								});
							})
							.catch((err) => {
								res.status(400).json({
									msg: "feed update failed",
									err,
								});
							});
					}
				} else {
					let updates = req.body;
					console.log("update without image ==>", updates);
					await Feed.findByIdAndUpdate(req.params.id, updates, { new: true })
						.then((updated_feed) => {
							res.status(201).json({
								msg: "feed updated successfully",
								updated_feed,
							});
						})
						.catch((err) => {
							res.status(400).json({
								msg: "feed update failed",
								err,
							});
						});
				}
			} catch (error) {
				res.status(500).json({
					msg: "feed update failed",
					error,
				});
			}
		} else {
			res.status(404).json({ nofeed: "No feed with this ID" });
		}
	});
};

//::::::::::::::::::::Delete feed::::::::::::::::::
const deleteFeed = async (req, res) => {
	await Feed.findById(req.params.id)
		.then(async (feed) => {
			if (req.user.isAdmin === false) {
				return res.status(401).json({ msg: "Only admin can delete feeds" });
			} else {
				feed.isActive = false;
				await feed
					.save()
					.then(() =>
						res.status(200).json({
							success: true,
							msg: "Feed deleted successfully",
						})
					)
					.catch((err) =>
						res.status(500).json({
							success: false,
							msg: "Feed deletion failed",
							err,
						})
					);
			}
		})
		.catch((err) => res.status(404).json({ msg: "No feed with this id", err }));
};

//::::::::::::::::::::comment on a Feed:::::::::::::::::::::::::::
const commentFeed = async (req, res) => {
	const { errors, isValid } = validateCommentData(req.body);
	if (!isValid) {
		return res.status(400).json({
			msg: "Invalid feed data",
			errors,
		});
	}

	if (!isValidObjectId(req.params.id)) {
		res.json({ msg: "invalid feed Id" });
	} else {
		await Feed.findById(req.params.id)
			.then((feed) => {
				if (feed) {
					//  new comment instance
					const newComment = new Comment({
						comment_description: req.body.comment_description,
						feed: req.params.id,
						user: req.user._id,
						user_name: req.user.first_name,
					});
					newComment
						.save()
						.then(async (comment) => {
							await feed.comments.push(newComment._id);
							feed.save();
							res.status(201).json({
								msg: "comment successfull",
								comment,
							});
							// console.log(feed.comments);
						})
						.catch((err) =>
							res.status(500).json({ msg: "Feed commenting failed", err })
						);
				} else {
					return res.status(404).json({ msg: "No feed with this ID" });
				}
			})
			.catch((err) =>
				res.status(404).json({ msg: "No feed with this ID", err })
			);
	}
};

// :::::::::::::Get All Comment That Belongs To A Feed::::::::::::::::
const allComment = async (req, res) => {
	await Comment.find({ feed: req.params.id }).then((comments) => {
		// console.log({ comments });
		if (!comments.length > 0)
			return res.status(404).json({ msg: "No comments for this feed yet" });
		let feedId = req.params.id;
		let commentCount = comments.length;
		return res.status(200).json({
			msg: "All comments",
			commentCount,
			feedId,
			data: comments,
		});
	});
};

//::::::::::::::::::::Like And Unlike a Feed::::::::::::::::::::::::::::
const likeUnlikeFeed = async (req, res) => {
	await Feed.findById(req.params.id)
		.then((feed) => {
			if (feed) {
				let vote_data = {
					user: req.user._id,
					gender: req.user.gender,
				};
				// console.log("vote_data::", vote_data);
				// if the liker is also the creator of the feed
				// if (feed.user.toString() === req.user._id) {
				// 	return res
				// 		.status(403)
				// 		.json({ msg: "You can not like your own feed" });
				// }

				//To initiate vote: check if user has never voted the feed
				if (
					feed.likes.filter((like) => like.user.toString() === req.user._id)
						.length === 0 &&
					feed.unLikes.filter(
						(unlike) => unlike.user.toString() === req.user._id
					).length === 0
				) {
					// if both equals true, then user must be trying to like feed
					feed.likes.unshift(vote_data);
					feed
						.save()
						.then((feed) => {
							feed.likeCount = feed.likes.length;
							feed.unLikeCount =
								feed.unLikes.length > 0 ? feed.unLikes.length : 0;
							res.status(200).json({
								msg: "feed liked",
								isLiked: true,
								feed,
							});
						})
						.catch((err) => res.status(500).json({ msg: "Like failed", err }));
				} else if (
					feed.likes.filter((like) => like.user.toString() === req.user._id)
						.length > 0 // user already liked post, must be trying to unlike instead
				) {
					// Get index of like to remove from likes array
					const remove_index = feed.likes
						.map((likes) => likes.user.toString())
						.indexOf(req.user._id);
					// Splice the like out of the array
					feed.likes.splice(remove_index, 1);
					feed.unLikes.unshift(vote_data);
					feed
						.save()
						.then((feed) => {
							feed.likeCount = feed.likes.length > 0 ? feed.likes.length : 0;
							feed.unLikeCount = feed.unLikes.length;
							res.status(200).json({
								msg: "feed unliked",
								isLiked: false,
								feed,
							});
						})
						.catch((err) =>
							res.status(500).json({ msg: "Unlike failed", err })
						);
				} else if (
					feed.unLikes.filter(
						(unlike) => unlike.user.toString() === req.user._id
					).length > 0 // user already unliked post, must be trying to like instead
				) {
					// Get index of unlike to remove from unlikes array
					const remove_index = feed.unLikes
						.map((unlikes) => unlikes.user.toString())
						.indexOf(req.user._id);
					// Splice the unlike out of the array
					feed.unLikes.splice(remove_index, 1);
					feed.likes.unshift(vote_data);
					feed
						.save()
						.then((feed) => {
							feed.likeCount = feed.likes.length;
							feed.unLikeCount =
								feed.unLikes.length > 0 ? feed.unLikes.length : 0;
							res.status(200).json({
								msg: "feed liked",
								isLiked: true,
								feed,
							});
						})
						.catch((err) => res.status(500).json({ msg: "like failed", err }));
				}
			} else {
				return res.status(404).json({ msg: "No feed with this ID" });
			}
		})
		.catch((err) =>
			res.status(403).json({ msg: "Problem voting on feed", err })
		);
};

module.exports = {
	createNewFeed,
	getAllFeeds,
	getFeedByID,
	updateFeed,
	deleteFeed,
	commentFeed,
	allComment,
	likeUnlikeFeed,
};
