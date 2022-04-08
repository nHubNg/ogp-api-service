require("dotenv").config();
const { createTransport } = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const mail = require("../utils/mail");
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const Redirect_URI = process.env.redirect_URI;
const refresh_Token = process.env.refresh_token;

const oauth2Client = new OAuth2(client_id, client_secret, Redirect_URI);
oauth2Client.setCredentials({
	refresh_token: refresh_Token,
});
const accessToken = oauth2Client.getAccessToken();

const smtpTransport = createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: mail.GMAIL_NAME,
		clientId: client_id,
		clientSecret: client_secret,
		refreshToken: refresh_Token,
		accessToken: accessToken,
	},
	tls: {
		rejectUnauthorized: false,
	},
});


const sendEmail = async (from, to, subject, html) => {
	return new Promise((resolve, reject) => {
		smtpTransport.sendMail({ from, to, subject, html }, (err, info) => {
			if (err) {
				console.log("mail_error ==>", err);
				return reject(err);
			}
			resolve(info);
			console.log({info});
		});
	});
};

module.exports = sendEmail;
