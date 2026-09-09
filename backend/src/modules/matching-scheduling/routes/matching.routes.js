import { Router } from 'express';
import requireAuth from '../../../../middleware/auth.js';
import { findMatchHandler } from '../controllers/matching-scheduling.controller.js';

const router = Router();

// POST /api/match/find - Run matching algorithm for current authenticated student
router.post('/find', requireAuth, findMatchHandler);

export default router;
