import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {redis} from "../lib/redis.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    return accessToken, refreshToken;
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const user = await User.create({ email, password, name });

    //Authenticate users
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    console.log(accessToken);
    console.log(refreshToken);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const login = (req, res) => {
  console.log("login was called");
};
export const logout = (req, res) => {
  console.log("logout was called");
};
