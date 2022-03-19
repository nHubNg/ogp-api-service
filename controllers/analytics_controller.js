const mongoose = require("mongoose");
const { Feed } = require("../models/feeds");
const { User } = require("../models/users");
const { Admin } = require("../models/admin");

const feedVotes = async (id) => {
	let all_votes = await Feed.findById(id);

	// total like and unlike
	let likes = all_votes.likes;
	let unLikes = all_votes.unLikes;

	// total likes by gender
	let m_like = [];
	let f_like = [];
	all_votes.likes.filter((like) => {
		like.gender === "male" ? m_like.push(like) : null;
		like.gender === "female" ? f_like.push(like) : null;
	});

	// total unlikes by gender
	let m_unlike = [];
	let f_unlike = [];
	all_votes.unLikes.filter((unlike) => {
		unlike.gender === "male" ? m_unlike.push(unlike) : null;
		unlike.gender === "female" ? f_unlike.push(unlike) : null;
	});

	// console.log("MALE-LIKE", m_like, "<==>", "FEMALE-LIKE", f_like);
	// console.log("MALE-UNLIKE", m_unlike, "<==>", "FEMALE-UNLIKE", f_unlike);
	return [
		likes.length,
		m_like.length,
		f_like.length,
		unLikes.length,
		m_unlike.length,
		f_unlike.length,
	];
};

// const countUsers = async () => {};

module.exports = {
	feedVotes,
};
