const validator = require("validator");
const isEmpty = require("../validation/isEmpty");

module.exports = function validateFeedData(data) {
	let errors = {};
	data.feed_title = !isEmpty(data.feed_title) ? data.feed_title : "";
	data.feed_description = !isEmpty(data.feed_description)
		? data.feed_description
		: "";
	data.tag = !isEmpty(data.tag) ? data.tag : "";

	if (validator.isEmpty(data.feed_title)) {
		errors.feed_title = "Title field is required";
	}
	// if (!validator.isLength(data.feed_description, { min: 10, max: 300 })) {
	// 	errors.feed_description = "Feed must be between 10 and 300 characters";
	// }
	if (validator.isEmpty(data.feed_description)) {
		errors.feed_description = "Description field is required";
	}
	if (validator.isEmpty(data.tag)) {
		errors.tag = "Tag field is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
