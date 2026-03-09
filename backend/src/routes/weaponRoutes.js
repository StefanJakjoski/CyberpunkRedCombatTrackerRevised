import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeCharacter, authorizeWeapon } from '../middleware/sessionMiddleware.js';
import { createWeapon, deleteAllWeaponsFromCharacterId, deleteWeaponById, getWeaponById, getWeapons, updateWeaponById } from '../controllers/weaponController.js';

const router = express.Router();

router.post('/', protect, authorizeCharacter, createWeapon);
router.get('/', protect, authorizeCharacter, getWeapons);
router.get('/:id', protect, authorizeWeapon, getWeaponById);
router.put("/:id", protect, authorizeWeapon, updateWeaponById);
router.delete("/:id", protect, authorizeWeapon, deleteWeaponById);
router.delete("/character/:id", protect, authorizeCharacter, deleteAllWeaponsFromCharacterId);

export default router;