import express from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  joinSessionById
} from "../controllers/sessionController.js";
import { authorizeSession } from "../middleware/sessionMiddleware.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", protect, createSession);
router.post("/:id/join", protect, joinSessionById)
router.get("/", protect, getSessions);
router.get("/:id", protect, authorizeSession, getSessionById);
router.put("/:id", protect, authorizeSession, updateSession);
router.delete("/:id", protect, authorizeSession, deleteSession);

export default router;
