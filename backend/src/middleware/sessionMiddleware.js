import Session from "../models/session.js";
import Character from "../models/character.js";
import Weapon from "../models/weapon.js";

export const authorizeSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id || req.body.sessionId; // get session id from route param or body
    if (!sessionId) return res.status(400).json({ message: "Session ID required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Allow if admin
    if (req.user.role === "admin") return next();

    // Allow if user is the owner of the session
    if (session.userId.toString() === req.user._id.toString()) return next();

    // Otherwise, forbidden
    return res.status(403).json({ message: "Forbidden: not authorized for this session" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const authorizeCharacter = async (req, res, next) => {
  try {
    const charId = req.params.id || req.body.characterId;
    if (!charId) return res.status(400).json({ message: "Character ID required" });

    const character = await Character.findById(charId).populate("sessionId");
    if (!character) return res.status(404).json({ message: "Character not found" });

    const session = character.sessionId;
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (
      req.user.role === "admin" ||
      character.ownerId.toString() === req.user._id.toString() ||
      session.userId.toString() === req.user._id.toString() || // session owner
      session.allowedUsers.map(id => id.toString()).includes(req.user._id.toString())
    ) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: not authorized for this character" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const authorizeCharacterCreation = async (req, res, next) => {  
  try {
    const sessionId = req.body.sessionId;
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (
      req.user.role === "admin" ||
      session.userId.toString() === req.user._id.toString() ||
      session.allowedUsers.map(id => id.toString()).includes(req.user._id.toString())
    ) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: cannot add character to this session" });
  } catch (err) {
    next(err);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const authorizeWeapon = async (req, res, next) => {
  try {
    const weaponId = req.params.id;
    if (!weaponId) return res.status(400).json({ message: "Weapon ID required" });

    const weapon = await Weapon.findById(weaponId);
    if (!weapon) return res.status(404).json({ message: "Weapon not found" });

    const character = await Character.findById(weapon.characterId).populate("sessionId");
    if (!character) return res.status(404).json({ message: "Character not found" });

    const session = character.sessionId;
    if (!session) return res.status(404).json({ message: "Session not found" });

    req.body = { ...req.body, weapon, character, session };

    if (
      req.user.role === "admin" ||
      character.ownerId.toString() === req.user._id.toString() ||
      session.userId.toString() === req.user._id.toString() || // session owner
      session.allowedUsers.map(id => id.toString()).includes(req.user._id.toString())
    ) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: not authorized for this character" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};