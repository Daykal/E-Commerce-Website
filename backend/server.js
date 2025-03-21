import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import authRouts from "./routes/auth.route.js"
import gameRouts from "./routes/games.route.js"
import cartRouts from "./routes/cart.route.js"
import { connectDB } from "./lib/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // parse body of request
app.use(cookieParser()); // parse cookies of request
app.use("/api/auth", authRouts);
app.use("/api/games", gameRouts);
app.use("/api/cart", cartRouts);

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);

  connectDB();
});
