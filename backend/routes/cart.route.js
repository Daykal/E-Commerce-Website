import express from "express";
import {
  getCartGames,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, getCartGames);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeFromCart);

export default router;
