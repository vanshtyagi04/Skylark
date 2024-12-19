import express from "express";
import {
	createPost,
	deletePost,
	getPost,
	likeUnlikePost,
	replyToPost,
	getFeedPosts,
	getUserPosts,
} from "../controllers/postController.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/feed", verifyJWT, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", verifyJWT, createPost);
router.delete("/:id", verifyJWT, deletePost);
router.put("/like/:id", verifyJWT, likeUnlikePost);
router.put("/reply/:id", verifyJWT, replyToPost);

export default router;