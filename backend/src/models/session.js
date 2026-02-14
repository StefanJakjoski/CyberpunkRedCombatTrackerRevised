import mongoose from "mongoose";

const sessionFormat = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    name: { type: String, default: "Encounter" },
}, { timestamps: true });

export default mongoose.model("Session", sessionFormat);