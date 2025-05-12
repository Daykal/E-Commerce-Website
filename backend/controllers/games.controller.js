import { json } from "express";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Games from "../models/games.model.js";

export const getAllGames = async (req, res) => {
  try {
    const games = await Games.find();
    res.json({ games });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeaturedGames = async (req, res) => {
  try {
    let featuredGames = await redis.get("featured_Games");

    if (featuredGames) {
      return res.json(JSON.parse(featuredGames));
    }
    // if not in redis then fetch from reris
    // lean() is gonna return a plain javascript object instead of mongodb document, better performance
    featuredGames = await Games.find({ isFeatured: true }).lean();
    if (!featuredGames) {
      return res.status(404).json({ message: "No featured games found" });
    }

    await redis.set("featured_Games", JSON.stringify(featuredGames));
    res.json(featuredGames);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const { name, description, downloadLink, price, image, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "games",
      });
    }

    const game = await Games.create({
      name,
      description,
      downloadLink,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Games.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    if (game.image) {
      const imageId = game.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`games/${imageId}`);
      } catch (err) {
        console.log(err.message);
      }
    }
    await Games.findByIdAndDelete(req.params.id);
    res.json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getRecommendedGames = async (req, res) => {
  try {
    const games = await Games.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getGamesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const games = await Games.find({ category });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const toggleFeaturedGame = async (req, res) => {
  try {
    const game = await Games.findById(req.params.id);
    if (game) {
      game.isFeatured = !game.isFeatured;
      const updatedGame = await game.save();
      await updateFeaturedGmaesCache();
      res.json(updatedGame);
    }else{
      res.status(404).json({ message: "Game not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

async function updateFeaturedGmaesCache() {
  try {
    const featuredGames = await Games.find({ isFeatured: true }).lean();
    redis.set("featured_Games", JSON.stringify(featuredGames));
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};