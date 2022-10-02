const express = require("express");
const { registerUser, loginUser, forgotPassword, logout, resetPassword,  updatePassword , getUserProfile} = require("../controllers/authControllers");
const router = express.Router();

const { isAuthenticatedUser } = require("../middlewares/auth")

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getUserProfile);




module.exports = router;
