import express from "express";

import {
	signupUser,
	loginUser,
	logoutUser,
	followUnFollowUser,
	updateUser,
	getUserProfile,
	getSuggestedUsers,
	freezeAccount,
    findUsersByName,
} from "../controllers/user.controller.js"
import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", verifyJWT, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", verifyJWT, followUnFollowUser);
router.put("/update/:id", verifyJWT, updateUser);
router.put("/freeze", verifyJWT, freezeAccount);
router.post("/search", verifyJWT , findUsersByName)
 
export default router;