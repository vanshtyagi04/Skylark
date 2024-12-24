import express from "express"
import verifyJWT from "../middleware/auth.middleware.js";
import { sendMessage, getMessages, getConversations } from "../controllers/messageController.js";


const router = express.Router();

router.post("/conversations", verifyJWT, getConversations);
router.get("/:otherUserId" , verifyJWT, getMessages);
router.post("/", verifyJWT, sendMessage);

export default router;