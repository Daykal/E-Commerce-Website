import express from "express";
import { getAllGames, getFeaturedGames, createGame, deleteGame, getRecommendedGames, getGamesByCategory, toggleFeaturedGame } from "../controllers/games.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllGames);
router.get("/featured",  getFeaturedGames);
router.get("/category/:category",  getGamesByCategory);
router.get("/recommendations", getRecommendedGames);
router.post("/", protectRoute, adminRoute, createGame);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedGame);
router.delete("/:id", protectRoute, adminRoute, deleteGame);

export default router;
