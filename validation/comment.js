const validator = require("validator");
const isEmpty = require("../validation/isEmpty");

module.exports = function validateCommentData(data) {
  let errors = {};
  data.comment_description = !isEmpty(data.comment_description) ? data.comment_description : "";


  if (!validator.isLength(data.comment_description, { min: 10, max: 300 })) {
    errors.comment_description = "Comment must be between 10 and 300 characters";
  }
  if (validator.isEmpty(data.comment_description)) {
    errors.comment_description = "Description field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
