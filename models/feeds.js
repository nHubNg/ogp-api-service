const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const feedSchema = new Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "user",
		},
		feed_title: {
			type: String,
			required: true,
		},
		feed_description: {
			type: String,
			required: true,
		},
		tag: {
			type: String,
			enum: [
				"Gender equality",
				"Fiscal transparency",
				"Citizens engagement",
				"Extractive transparency",
				"Peace and Security",
			],
		},
		feed_media: {
			type: [String],
			required: [true, "An image or video file is required to create a feed"],
		},
		vote: {
			type: String,
			enum: ["like", "unLike"],
		},
		likes: [
			{
				user: {
					type: mongoose.Types.ObjectId,
					ref: "user",
				},
				gender: {
					type: String,
				},
			},
		],
		unLikes: [
			{
				user: {
					type: mongoose.Types.ObjectId,
					ref: "user",
				},
				gender: {
					type: String,
				},
			},
		],
		likeCount: Number,
		unLikeCount: Number,
		comments: [
			{
				type: mongoose.Types.ObjectId,
				ref: "comment",
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = { Feed: model("feed", feedSchema) };
