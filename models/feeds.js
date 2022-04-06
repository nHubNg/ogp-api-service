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
		feed_media: [],
		// // feed_image: {
		// // 	type: String,
		// 	required: [true, "Feed image is required"],
		// },
		// feed_image_id: {
		// 	type: String,
		// },
		// feed_video: [],
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
		comments: [
			{
				user: {
					type: mongoose.Types.ObjectId,
					ref: "user",
				},
				comment_description: {
					type: String,
					required: true,
				},
				date: {
					type: Date,
					default: Date.now,
				},
				replies: [
					{
						user: {
							type: mongoose.Types.ObjectId,
							ref: "user",
						},
						reply_text: {
							type: String,
							required: true,
						},
						date: {
							type: Date,
							default: Date.now,
						},
					},
				],
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
