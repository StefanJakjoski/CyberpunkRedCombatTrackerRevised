import Session from "../models/session.js";
import Character from "../models/character.js";

// Create a new session
export const createSession = async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, userId: req.user._id, allowedUsers: [req.user._id.toString()] });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Post a new user to existing session by ID
export const joinSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Session owner doesn't need to be added
    if (session.userId.toString() === req.user._id.toString()) {
      return res.status(200).json(session);
    }

    // Already allowed? No-op
    const alreadyAllowed = session.allowedUsers
      .map(id => id.toString())
      .includes(req.user._id.toString());

    if (!alreadyAllowed) {
      session.allowedUsers.push(req.user._id.toString());
      await session.save();
    }

    return res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sessions
export const getSessions = async (req, res) => {
  try {
    //console.log(req.user._id.toString(), typeof req.user._id);
    const sessions = req.user.role === "admin"
      ? await Session.find().populate("characters")
      : await Session.find({ $or: [         // match sessions to owner or allowed users
          { userId: req.user._id },
          { allowedUsers: req.user._id }
        ]}).populate("characters");

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("characters");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a session
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("characters");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Optional: delete all characters associated with this session
    await Character.deleteMany({ sessionId: session._id });

    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
