import Character from "../models/character.js";
import Session from "../models/session.js"

// Create a character (owner is current user)
export const createCharacter = async (req, res) => {
  try {
    const character = await Character.create({
      ...req.body,
      ownerId: req.user._id
    });
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get characters: admin sees all, others see own or sessions they have access to
export const getCharacters = async (req, res) => {
  try {
    const characters = req.user.role === "admin"
      ? await Character.find().populate("sessionId").populate("weapons")
      : await Character.find({
          $or: [
            { ownerId: req.user._id },
            { sessionId: { $in: (await Session.find({ $or: [
                { userId: req.user._id },
                { allowedUsers: req.user._id }
              ]})).map(s => s._id) } }
          ]
        }).populate("sessionId").populate("weapons");

    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all characters pertaining to a sessionId
export const getCharactersBySession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });

    // Fetch the session to check permissions
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if user has access: admin, session owner, or allowed user
    const hasAccess =
      req.user.role === "admin" ||
      session.userId.toString() === req.user._id.toString() ||
      session.allowedUsers.map(id => id.toString()).includes(req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden: cannot view this session's characters" });
    }

    // Fetch characters belonging to this session
    const characters = await Character.find({ sessionId }).populate("sessionId").populate("weapons");

    res.json(characters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single character by ID
export const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate("sessionId").populate("weapons");
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.json(character);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a character
export const updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.json(character);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a character
export const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.json({ message: "Character deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
