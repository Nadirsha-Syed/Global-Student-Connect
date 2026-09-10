import express from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Student Registration & Authentication
router.post('/signup', signup);
router.post('/login', login);

// Student Profile Management (Protected)
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
