const express = require("express");
const { newPost, getPost,  getSinglePost, updatePost, deletePost, createPostComment, getPostComment, deletePostComment } = require("../controllers/postControllers");
const router = express.Router();


const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/posts").get(getPost);
router.route("/post/new").post(isAuthenticatedUser,  newPost);
router.route("/post/:id").get(getSinglePost);
router.route("/post/:id").put(isAuthenticatedUser, updatePost).delete(isAuthenticatedUser, deletePost);

router.route("/comment").put(isAuthenticatedUser, createPostComment)
router.route("/comments").get(isAuthenticatedUser, getPostComment)
router.route("/comments").delete(isAuthenticatedUser, deletePostComment)

module.exports = router;

