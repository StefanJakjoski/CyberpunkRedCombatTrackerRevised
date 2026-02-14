import express from 'express';
import { createCharacter, getCharacters, getCharacterById, 
    updateCharacter, deleteCharacter, 
    getCharactersBySession} from '../controllers/characterController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { authorizeCharacter, authorizeCharacterCreation } from '../middleware/sessionMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeCharacterCreation, createCharacter);
router.get('/', protect, getCharacters);
router.get('/session/:sessionId', protect, getCharactersBySession);
router.get('/:id', protect, authorizeCharacter, getCharacterById);
router.put("/:id", protect, authorizeCharacter, updateCharacter);
router.delete("/:id", protect, authorizeCharacter, deleteCharacter);

export default router;

