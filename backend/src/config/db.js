import mongoose from "mongoose"

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is undefined. Check your .env file!");
        process.exit(1);
    }
    
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || "CPRedCombatTracker",
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};