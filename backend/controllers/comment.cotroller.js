import Comment from "../models/comment.model.js";
import Game from "../models/games.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getComments = async (req, res) => {
  try {
    const gameId = req.query.gameId;
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }
    const comments = await Comment.find({ gameId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};
export const createComment = async (req, res) => {
  try {
    const { text, userId, gameId } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(gameId)
    ) {
      return res.status(400).json({ message: "Invalid user ID or game ID" });
    }
    const gameExist = await Game.findById(gameId);
    const userExist = await User.findById(userId);
    if (!gameExist || !userExist) {
      return res.status(404).json({ message: "Game or user not found" });
    }
    console.log(text, userId, gameId);
    const comment = new Comment({ text, userId, gameId });
    await comment.save();
    res.status(201).json({ message: "comment created successfully", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    if (!text || text.length > 1000) {
      return res.status(400).json({ message: "Invalid comment text" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    comment.text = text;
    await comment.save();
    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
