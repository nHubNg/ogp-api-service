const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	// destination: './public/uploads/',
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg"
	) {
		cb(null, true);
	} else {
		//reject file
		cb({ message: "Unsupported file format" }, false);
	}
};
//initialize the file uplaod
const upload = multer({ storage, fileFilter });

module.exports = upload;
