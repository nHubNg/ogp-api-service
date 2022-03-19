const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateRegisterData = (data) => {
  let errors = {};
  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = "firstname field is required";
  }

  if (validator.isEmpty(data.last_name)) {
    errors.last_name = "lastname field is required";
  }

  if (validator.isEmpty(data.gender)) {
    errors.gender = "gender is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (!validator.isLength(data.password, { min: 4, max: 10 })) {
    errors.password = "Password must be between 4 and 10 characters";
  }
  if (validator.isEmpty(data.phone)) {
    errors.phone = "Phone Number is required";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match ";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
