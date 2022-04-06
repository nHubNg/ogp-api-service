const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { User } = require("../models/users");
const { Admin } = require("../models/admin");
const validateLoginData = require("../validation/login");
const { forgotPasswordMail } = require("../utils/Mailings");

//:::::::::::::::::::Login:::::::::::::::::::::::::::
const httpLoginUser = (req, res) => {
	try {
		const { errors, isValid } = validateLoginData(req.body);
		if (!isValid) {
			res.status(400).json(errors);
			return;
		}
		const { email, password } = req.body;
		// Find user by mail
		User.findOne({ email }).then((user) => {
			if (!user) {
				Admin.findOne({ email }).then((user) => {
					if (!user) {
						errors.email = "No user with this email";
						return res.status(404).json(errors);
					} else if (user && user.isVerified === false) {
						return res.status(401).json({
							success: false,
							msg: "Please check your email to confirm your identity",
						});
					} else {
						// Compare password to hashed password
						bcrypt.compare(password, user.password).then((isMatch) => {
							if (isMatch) {
								// generate token
								const payload = {
									user,
									isLoggedIn: true
								};
								let token = jwt.sign(payload, process.env.JWTsecret, {
									expiresIn: "365d",
								});

								res.status(200).json({
									success: true,
									msg: "Login successful",
									data: {
										token,
										user: {
											...user._doc,
										},
									},
								});
							} else {
								return res.status(400).json({
									success: false,
									msg: "password incorrect",
								});
							}
						});
					}
				});
			} else if (user && user.isVerified === false) {
				return res.status(401).json({
					success: false,
					msg: "Please check your email to confirm your identity",
				});
			} else {
				// Compare password to hashed password
				bcrypt.compare(password, user.password).then((isMatch) => {
					if (isMatch) {
						// generate token
						const payload = {
							user,
							isLoggedIn: true
						};
						let token = jwt.sign(payload, process.env.JWTsecret, {
							expiresIn: "365d",
						});

						res.status(200).json({
							success: true,
							msg: "Login successful",
							data: {
								token,
								user: {
									...user._doc,
								},
							},
						});
					} else {
						return res.status(400).json({
							success: false,
							msg: "password incorrect",
						});
					}
				});
			}
		});
	} catch (error) {
		res.status(500).json({
			msg: error.message,
		});
	}
};

//::::::::::::::::::Verify user's mail:::::::::::::::::
const confirmEmail = async (req, res) => {
	let secretToken = req.params.token;

	if (!secretToken)
		return res.status(400).json({ msg: "No secret token in params" });

	const userWithToken = await User.findOne({ secret_token: secretToken });
	if (!userWithToken) return res.status(404).json({ msg: "Invalid token" });

	userWithToken.isVerified = true;
	userWithToken.secret_token = undefined;
	await userWithToken.save();

	return res.status(200).json({
		msg: "User account verified. You can now login",
	});
};

//:::::::::::::::::::Forgot Password:::::::::::::::::::
const forgotPassword = (req, res) => {
	const { email } = req.body;
	console.log("EMAIL===>", email);
	if (!email) return res.status(400).json({ msg: "Enter an email" });
	Admin.findOne({ email: email }, async (err, user) => {
		if (!user) {
			User.findOne({ email: email }, (err, user) => {
				if (err)
					return res.status(404).json({
						msg: "No user with this mail",
					});
				else {
					console.log("USER===>", user);
					const token = jwt.sign({ id: user._id }, process.env.JWTsecret, {
						expiresIn: "20m",
					});
					console.log("token------>", token);
					return user.updateOne({ reset_token: token }, (err, success) => {
						if (err) {
							console.log(`failed to update reset link`);
							req.status(500).json({
								msg: "failed to update reset link",
							});
						} else {
							forgotPasswordMail(req, user.email, token);
							res.status(200).json({
								msg: "Password reset mail sent successfully",
							});
						}
					});
				}
			});
		} else {
			console.log("ADMIN===>", user);
			const token = jwt.sign({ id: user._id }, process.env.JWTsecret, {
				expiresIn: "20m",
			});
			console.log("token------>", token);
			return user.updateOne({ reset_token: token }, (err, success) => {
				if (err) {
					console.log(`failed to update reset link`);
					req.status(500).json({
						msg: "failed to update reset link",
					});
				} else {
					forgotPasswordMail(req, user.email, token);
					res.status(200).json({
						msg: "Password reset mail sent successfully",
					});
				}
			});
		}
	});
};

//:::::::::::::::::Reset password:::::::::::::::::
const resetPassword = async (req, res) => {
	let reset_token = req.params.token;
	let { new_password, new_password2 } = req.body;
	if (!new_password || !new_password2)
		return res
			.status(400)
			.json({ msg: "Passwords and Confirm Password are required" });
	if (new_password !== new_password2)
		return res.status(400).json({ msg: "Passwords do not match" });
	if (reset_token) {
		// console.log("DETAILS", req.body, reset_token);
		jwt.verify(reset_token, process.env.JWTsecret, (err, decoded) => {
			if (err) return res.status(500).json({ msg: "Invalid or expired token" });
			Admin.findOne({ reset_token: reset_token }, (err, user) => {
				if (!user) {
					User.findOne({ reset_token: reset_token }, (err, user) => {
						if (!user)
							return res.status(404).json({ msg: "No user With this token" });
						else {
							console.log("USER===>", user);
							bcrypt.genSalt(10, (err, salt) => {
								bcrypt.hash(new_password, salt, (err, hash) => {
									if (err) throw err;
									new_password = hash;

									const obj = {
										password: new_password,
										reset_token: "",
									};
									user = _.extend(user, obj);
									user.save((err, saved) => {
										if (err) throw err;
										res
											.status(200)
											.json({ msg: "password reset successfully" });
									});
								});
							});
						}
					});
				} else {
					console.log("ADMIN===>", user);
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(new_password, salt, (err, hash) => {
							if (err) throw err;
							new_password = hash;

							const obj = {
								password: new_password,
								reset_token: "",
							};
							user = _.extend(user, obj);
							user.save((err, saved) => {
								if (err) throw err;
								res.status(200).json({ msg: "password reset successfully" });
							});
						});
					});
				}
			});
		});
	} else {
		res.status(400).json({ msg: "No reset_token in params" });
	}
};
module.exports = {
	httpLoginUser,
	confirmEmail,
	forgotPassword,
	resetPassword,
};
