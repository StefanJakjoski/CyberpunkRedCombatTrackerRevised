import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import characterRoutes from './routes/characterRoutes.js'
import authGuardRoutes from './routes/authGuardRoutes.js'
import weaponRoutes from './routes/weaponRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/api/", (req, res) => res.send("API running"));
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/auth-guard', authGuardRoutes);
app.use('/api/weapon', weaponRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));