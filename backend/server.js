import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRouts from "./routes/auth.route.js"
import gameRouts from "./routes/games.route.js"
import cartRouts from "./routes/cart.route.js"
import couponRouts from "./routes/coupon.route.js"
import paymentRouts from "./routes/payment.route.js"
import analyticsRouts from "./routes/analytics.route.js"
import commentRouts from "./routes/comment.route.js"
import { connectDB } from "./lib/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));

app.use(express.json({ limit: "8mb"})); // parse body of request
app.use(cookieParser()); // parse cookies of request
app.use("/api/auth", authRouts);
app.use("/api/games", gameRouts);
app.use("/api/cart", cartRouts);
app.use("/api/coupons", couponRouts);
app.use("/api/payments", paymentRouts);
app.use("/api/analytics", analyticsRouts);
app.use("/api/comments", commentRouts);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);

  connectDB();
});
