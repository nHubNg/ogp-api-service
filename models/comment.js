const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
	feed: {
		type: mongoose.Types.ObjectId,
		ref: "feed",
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "user",
	},
	user_name: {
		type: String,
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
});

module.exports = { Comment: model("comment", commentSchema) };
