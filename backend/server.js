import express from "express";
import dotenv from "dotenv";

import authRouts from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;


app.use("/api/auth", authRouts);

app.get("/", (req, res) => {
    console.log("homepage");
    res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);

  connectDB();
});
