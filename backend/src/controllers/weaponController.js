import Weapon from "../models/weapon.js";
import Character from "../models/character.js";

// ----------------------- CREATE WEAPON -----------------------
export const createWeapon = async (req, res) => {
  try {
    const { characterId, ...weaponData } = req.body;

    // Character existence is assumed to be checked by authorizeCharacterCreation middleware
    const weapon = await Weapon.create({ ...weaponData, characterId });

    // Add weapon reference to character
    await Character.findByIdAndUpdate(characterId, { $push: { weapons: weapon._id } });

    res.status(201).json(weapon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----------------------- GET ALL WEAPONS -----------------------
export const getWeapons = async (req, res) => {
  try {
    // Middleware should ensure the user can access only characters they own
    const weapons = await Weapon.find().populate("characterId");
    res.json(weapons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- GET WEAPON BY ID -----------------------
export const getWeaponById = async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id).populate("characterId");
    if (!weapon) return res.status(404).json({ message: "Weapon not found" });

    // Authorization handled by authorizeCharacter middleware
    res.json(weapon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- UPDATE WEAPON -----------------------
export const updateWeaponById = async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("characterId");

    if (!weapon) return res.status(404).json({ message: "Weapon not found" });

    // Authorization handled by middleware
    res.json(weapon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----------------------- DELETE WEAPON -----------------------
export const deleteWeaponById = async (req, res) => {
  try {
    //const weapon = await Weapon.findById(req.params.id);
    const weapon = req.body.weapon;
    if (!weapon) return res.status(404).json({ message: "Weapon not found" });

    // Remove weapon reference from character
    await Character.findByIdAndUpdate(weapon.characterId, { $pull: { weapons: weapon._id } });

    // Delete the weapon itself
    await weapon.deleteOne();

    res.json({ message: "Weapon deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------------- DELETE ALL WEAPONS FOR CHARACTER -----------------------
export const deleteAllWeaponsFromCharacterId = async (req, res) => {
  try {
    const characterId = req.params.id;

    // Find all weapons for the character
    const weapons = await Weapon.find({ characterId });
    if (weapons.length === 0) {
      return res.status(404).json({ message: "No weapons found for this character" });
    }

    const weaponIds = weapons.map(w => w._id);

    // Remove all weapon references from the character
    await Character.findByIdAndUpdate(characterId, { $pull: { weapons: { $in: weaponIds } } });

    // Delete all weapons linked to the character
    await Weapon.deleteMany({ characterId });

    res.json({ message: `Deleted ${weaponIds.length} weapons for character ${characterId}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};