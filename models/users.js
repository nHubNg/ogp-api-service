const { Schema, model } = require("mongoose");
const userSchema = new Schema(
	{
		first_name: {
			type: String,
			require: true,
		},
		last_name: {
			type: String,
			require: true,
		},
		user_name: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			immutable: true,
		},
		phone: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			enum:  ["male", "female"],
		},
		avatar: {
			type: String,
		},
		avatar_id: {
			type: String,
		},
		home_address: {
			type: String,
		},
		isAdmin: {
			type: Boolean,
			required: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		secret_token: {
			type: String,
		},
		reset_token: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

module.exports = { User: model("user", userSchema) };
