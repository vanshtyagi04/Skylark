import express from "express";

import {
	signupUser,
	loginUser,
	logoutUser,
	followUnFollowUser,
	updateUser,
	getUserProfile,
    findUsersByName,
} from "../controllers/userController.js"
import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", verifyJWT, followUnFollowUser);
router.put("/update/:id", verifyJWT, updateUser);
router.post("/search", verifyJWT , findUsersByName)
 
export default router;