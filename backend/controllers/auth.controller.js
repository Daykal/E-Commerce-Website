import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return accessToken, refreshToken;
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent XSS attack, cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attacks, cross site request forgery attacks
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("accessToken", refreshToken, {
    httpOnly: true, //prevent XSS attack, cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attacks, cross site request forgery attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
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

    setCookies(res, accessToken, refreshToken);

    console.log(accessToken);
    console.log(refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
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
