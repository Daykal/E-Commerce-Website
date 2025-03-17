import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MogoDB connected: ${connection.connection.host}`);
    } catch (err) {
        console.log("Error connecting to MongoBD", err.message);
        process.exit(1);
    }  
};