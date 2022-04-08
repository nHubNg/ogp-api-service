const mongoose = require("mongoose");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const randomString = require("randomstring");
const { User } = require("../models/users");
const validateRegisterData = require("../validation/register");
const cloudinary = require("cloudinary").v2;
const cloudinarySetup = require("../configs/cloudinary");
const { welcomeEmail } = require("../utils/Mailings");

//::::::::::::::::Create User::::::::::::::::::
const createNewUser = async (req, res) => {
	try {
		// console.log(req.body);
		// validate body data
		const { errors, isValid } = validateRegisterData(req.body);
		if (!isValid)
			return res.status(400).json({
				msg: "Inavalid registration data, check your input data",
				errors,
			});

		let { first_name, last_name, email, gender, phone, password } = req.body;
		// check if user already exist
		await User.findOne({ email: email }).then((user) => {
			if (user) {
				return res.status(409).json({
					success: false,
					msg: "Email already exist",
				});
			} else {
				const secret_token = randomString.generate();
				const newUser = new User({
					first_name,
					last_name,
					email,
					gender,
					phone,
					password,
					secret_token,
				});
				// validate gender before proceeding
				let error = newUser.validateSync();
				// console.log(error);
				if (error) {
					assert.equal(
						error.errors["gender"].message,
						`${gender} is not a valid gender type`
					);
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, async (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							const mailInfo = await welcomeEmail(
								req,
								newUser.first_name,
								newUser.email,
								newUser.secret_token
							);
							// console.log("MAIL_INFO", mailInfo.accepted.length);
							if (mailInfo.accepted.length === 0) {
								return res.status(500).json({
									success: false,
									msg: "Verification email sending failed, please try again",
								});
							} else {
								await newUser
									.save()
									.then(async (user) => {
										res.status(201).json({
											success: true,
											msg: "User registered successfully, check your email for verification",
											user,
										});
									})
									.catch((err) =>
										res.status(500).json({
											success: false,
											msg: "User registration failed",
											err,
										})
									);
							}
						});
					});
				}
			}
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "User registration failed",
			error: error.expected ? error.expected : error.message,
		});
	}
};

//::::::::::::: Update User Profile::::::::::::
const updateUser = async (req, res) => {
	console.log(req.user._id);
	// find logged in user
	await User.findById(req.user._id).then(async (user) => {
		if (user) {
			console.log(user._id); //objectId of logged in user
			try {
				// check to make sure the user found and logged in user are thesame person
				if (req.user._id.toString() !== user._id.toString())
					return res.status(401).json({ msg: "Not authorized" });
				// check to see if user avatar is part of update details
				if (req.file) {
					await cloudinarySetup();
					await cloudinary.uploader.destroy(req.user.avatar_id);
					const uploadProfileImage = await cloudinary.uploader.upload(
						req.file.path,
						{
							resource_type: "auto",
						}
					);
					if (!uploadProfileImage)
						return res.status(500).json({ msg: "Problem uploading image" });
					else {
						let updates = {
							...req.body,
							avatar: uploadProfileImage.secure_url || req.user.avatar,
							avatar_id: uploadProfileImage.public_id || req.user.avatar_id,
						};
						console.log("updates with image ==>", updates);
						await User.findByIdAndUpdate(req.user._id, updates, { new: true })
							.then((updated_user) => {
								res.status(201).json({
									msg: "user profile updated successfully",
									updated_user,
								});
							})
							.catch((err) => {
								res.status(500).json({
									msg: "User profile update failed",
									err,
								});
							});
					}
				} else {
					let updates = req.body;
					console.log("update without image ==>", updates);
					await User.findByIdAndUpdate(req.user._id, updates, { new: true })
						.then((updated_user) => {
							res.status(201).json({
								msg: "user profile updated successfully",
								updated_user,
							});
						})
						.catch((err) => {
							res.status(400).json({
								msg: "User profile update failed",
								err,
							});
						});
				}
			} catch (error) {
				res.status(500).json({
					msg: "User profile update failed",
					error,
				});
			}
		} else {
			res.status(401).json({ msg: "Not authorized" });
		}
	});
};

//:::::::::::Delete user and thier entire Profile::::::::::::::
const deleteUser = async (req, res) => {
	User.findByIdAndDelete(req.user._id).then(() => {
		res.status(200).json({
			success: true,
			message: "Your account has been deleted successfully",
		});
	});
};

const allUsers = async (req, res) => {};

module.exports = {
	createNewUser,
	updateUser,
	deleteUser,
};
