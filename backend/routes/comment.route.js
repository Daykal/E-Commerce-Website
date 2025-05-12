import express from "express";
import { getComments, createComment, deleteComment, updateComment } from "../controllers/comment.cotroller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", protectRoute, createComment);
router.patch("/", protectRoute, updateComment);
router.delete("/", protectRoute, deleteComment);


export default router;