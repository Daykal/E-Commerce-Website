import Games from "../models/games.model.js";

export const getAllGames = async (req, res) => {

    try {
        const games = await Games.find();
        res.json({games});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
