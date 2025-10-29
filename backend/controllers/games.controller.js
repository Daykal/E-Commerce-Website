import { redis } from "../lib/redis.js";
import dotenv from "dotenv";
import s3Client from "../lib/minio.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Games from "../models/games.model.js";

dotenv.config();

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
    const { name, description, downloadLink, price, image, category } =
      req.body;

    let imageUrl = "";
    if (image) {
      try {
        //Extract MIME type from base64
        const matches = image.match(/^data:(image\/\w+);base64,/);
        if (!matches) throw new Error("Invalid image format");

        const mimeType = matches[1]; // e.g., 'image/png'
        const ext = mimeType.split("/")[1]; // e.g., 'png'

        //Generate unique filename
        const fileKey = `games/${Date.now()}-${Math.round(
          Math.random() * 1e6
        )}.${ext}`;

        //Convert base64 -> buffer
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        //Upload to MinIO
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.MINIO_BUCKET,
            Key: fileKey,
            Body: buffer,
            ContentType: mimeType,
          })
        );

        //Generate public URL (HTTP only for local Docker)
        imageUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${fileKey}`;

        console.log(`Uploaded image to MinIO: ${imageUrl}`);
      } catch (err) {
        console.error(
          `Error uploading image to MinIO: ${imageUrl}`,
          err.message
        );
        return res
          .status(500)
          .json({ message: "Failed to upload image", error: err.message });
      }
    }

    const game = await Games.create({
      name,
      description,
      downloadLink,
      price,
      image: imageUrl,
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
      try {
        // Extract the object key from the URL
        const url = new URL(game.image);
        const key = url.pathname.split("/").slice(2).join("/");
        // slice(2) skips the leading '/' and bucket name in path: /bucket/key

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.MINIO_BUCKET,
            Key: key,
          })
        );

        console.log(`Deleted ${key} from MinIO`);
      } catch (err) {
        console.log("Error deleting from MinIO:", err.message);
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
    } else {
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
}
