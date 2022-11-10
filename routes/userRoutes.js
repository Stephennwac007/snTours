const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// signup
router.post("/signup", authController.signup);
// login
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMypassword",
  authController.protect,
  authController.updateMyPassword
);

router.patch("/updateMe", authController.protect, updateMe);

router.delete("/deleteMe", authController.protect, deleteMe);

//USER ROUTES
router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
