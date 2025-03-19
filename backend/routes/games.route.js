import express from "express";
import { getAllGames, getFeaturedGames } from "../controllers/games.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllGames);
router.get("/featured",  getFeaturedGames);

export default router;
