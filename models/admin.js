const { Schema, model } = require("mongoose");
const adminSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		isAdmin: {
			type: Boolean,
			default: true,
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

module.exports = { Admin: model("admin", adminSchema) };
