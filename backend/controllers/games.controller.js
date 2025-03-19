import { json } from "express";
import {redis} from "../lib/redis.js";
import Games from "../models/games.model.js";

export const getAllGames = async (req, res) => {
  try {
    const games = await Games.find();
    res.json({ games });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeaturedGames = async(req, res) => {
  try {
    let featuredGames = await redis.get('featured_Games');

    if (featuredGames) {
        return res.json(JSON.parse(featuredGames));
    }

  } catch (err) {}
};
