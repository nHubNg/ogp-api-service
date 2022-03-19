const sendEmail = require("../configs/mailer");

const welcomeEmail = async (req, username, email, secretToken) => {
	const html = `
    Welcome to Plateau State OGP platform ${username}, we're excited to have you join us.
    <br/>
    click on the link below to activate you account.
    <br/><br/>
    Confirmation Link: http://${req.headers.host}/api/v1/auth/confirm-mail/${secretToken}
    <br/>
    <br/>
    <strong>OGP Team</strong>
  `;

	return await sendEmail("support@ogp.com", email, "OGP Account Verification", html);
};

const forgotPasswordMail = async (req, email, resetToken) => {
	const html = `
    You are recieving this mail because you have requested for a password reset.
    <br/>
    <br/>
    Password Reset Link: http://${req.headers.host}/api/v1/auth/reset-password/${resetToken}
    <br/>
    <br/>
    If you did not request for this, take neccessary precautions to protect you account, 
    <strong>OGP Team</strong>
  `;

	await sendEmail("support@ogp.com", email, "OGP Password Reset", html);
};

module.exports = { welcomeEmail, forgotPasswordMail };
