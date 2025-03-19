import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
},
price:{
    type: Number,
    required: true,
    min: 0,
},
image:{
    type: String,
    required: [true, "A game must have a image"],
},
category: {
    type: String,
    required: [true, "A game must have a category"],
},
isFeatured:{
    type: Boolean,
    default: false,
},
},
{timestamps: true});



const Games = mongoose.model("Game", gameScgema);

export default Games;