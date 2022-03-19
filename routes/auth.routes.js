const express = require("express");
const router = express.Router();
const {
	httpLoginUser,
	confirmEmail,
	forgotPassword,
	resetPassword,
} = require("../controllers/auth_controller");

//@Login Route POST api/v1/login
//@description Users login route
//@access public
router.post("/login", httpLoginUser);

//@Confirm Mail Route POST api/v1/confirm-mail
//@description New users email verification
//@access public
router.post("/confirm-mail/:token", confirmEmail);

//@Forgot Password Route PUT api/v1/forgot-password
//@description paswword reset link
//@access public
router.put("/forgot-password", forgotPassword);

//@Reset Password Route PUT api/v1/reset-password
//@description paswword reset
//@access public
router.put("/reset-password/:token", resetPassword);

module.exports = router;
