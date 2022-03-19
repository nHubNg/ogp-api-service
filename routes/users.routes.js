const express = require("express");
const router = express.Router();
const {
	createNewUser,
	updateUser,
	deleteUser,
} = require("../controllers/users_controller");
const upload = require("../configs/multer");
const auth = require("../middlewares/authVerifier");

//@Register Route POST api/v1/user
//@description register new user
//@access public
router.post("/register", createNewUser);

//@Update Route PUT api/v1/user/update
//@description update user
//@access private
router.put("/update", auth, upload.single("avatar"), updateUser);

//@Delete Route POST api/v1/user/delete
//@description delete user
//@access private
router.delete("/delete", auth, deleteUser);

module.exports = router;
