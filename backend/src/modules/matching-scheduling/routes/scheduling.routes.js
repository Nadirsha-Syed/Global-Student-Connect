import { Router } from 'express';
import requireAuth from '../../../../middleware/auth.js';
import {
  setAvailabilityHandler,
  getAvailabilityHandler,
  bookSessionHandler,
  getMySessionsHandler,
  cancelSessionHandler,
} from '../controllers/matching-scheduling.controller.js';

const router = Router();

// Availability endpoints
router.post('/availability', requireAuth, setAvailabilityHandler);
router.get('/availability/:userId', requireAuth, getAvailabilityHandler);

// Booking and session management endpoints
router.post('/book', requireAuth, bookSessionHandler);
router.get('/sessions/my', requireAuth, getMySessionsHandler);
router.patch('/sessions/:sessionId/cancel', requireAuth, cancelSessionHandler);

export default router;
