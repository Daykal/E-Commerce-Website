import Games from "../models/games.model.js";

export const getCartGames = async (req, res) => {
  try {
    const Games = await Games.find({ _id: { $in: req.user.cartItems } });

    res.json(Games);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { GameId } = req.body;

    const user = req.user;

    const existingGame = await user.cartItems.find(
      (item) => item.id === GameId
    );
    if (existingGame) {
      alert("Game already in cart");
    } else {
      user.cartItems.push(GameId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { GameId } = req.body;
    const user = req.user;
    if (!GameId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== GameId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};
