import { Router } from 'express';
import requireAuth from '../../../../middleware/auth.js';
import {
  setAvailabilityHandler,
  getAvailabilityHandler,
  bookSessionHandler,
  getMySessionsHandler,
  cancelSessionHandler,
  createReflectionHandler,
  getSessionReflectionsHandler,
  getMyReflectionsHandler,
} from '../controllers/matching-scheduling.controller.js';

const router = Router();

// Availability endpoints
router.post('/availability', requireAuth, setAvailabilityHandler);
router.get('/availability/:userId', requireAuth, getAvailabilityHandler);

// Booking and session management endpoints
router.post('/book', requireAuth, bookSessionHandler);
router.get('/sessions/my', requireAuth, getMySessionsHandler);
router.patch('/sessions/:sessionId/cancel', requireAuth, cancelSessionHandler);

// Post-Call Reflection endpoints
router.post('/sessions/:sessionId/reflection', requireAuth, createReflectionHandler);
router.get('/sessions/:sessionId/reflection', requireAuth, getSessionReflectionsHandler);
router.get('/reflections/my', requireAuth, getMyReflectionsHandler);

export default router;
