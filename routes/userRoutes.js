const express = require("express");
const {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
} = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// signup
router.post("/signup", authController.signup);
router.post("/login", authController.login);


//USER ROUTES
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
