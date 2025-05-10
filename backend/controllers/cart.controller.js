import Games from "../models/games.model.js";

export const getCartGames = async (req, res) => {
  try {
    const games = await Games.find({ _id: { $in: req.user.cartItems } });

    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = req.user;
    
    const existingGame = await user.cartItems.find(
      (item) => item === gameId
    );
    if (existingGame) {
      alert("Game already in cart");
    } else {
      user.cartItems.push(gameId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const removeFromCart = async (req, res) => {
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
