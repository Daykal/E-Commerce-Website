import express from "express";
import {getAllGames} from "../controllers/games.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute,getAllGames);

export default router;
