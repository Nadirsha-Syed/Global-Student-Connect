import { Router } from 'express';
import requireAuth, { optionalAuth } from '../../../../middleware/auth.js';
import {
  findMatchHandler,
  getAllMatchesHandler,
  getRecommendationsHandler,
  getMatchByIdHandler,
  requestConnectionHandler,
  getIncomingRequestsHandler,
  getOutgoingRequestsHandler,
  acceptConnectionHandler,
  declineConnectionHandler,
  getConnectionStatusHandler,
} from '../controllers/matching-scheduling.controller.js';

const router = Router();

// GET /api/match or /api/matches - Retrieve peer matches from real DB
router.get('/', optionalAuth, getAllMatchesHandler);

// GET /api/match/recommendations - Retrieve top recommendations from real DB
router.get('/recommendations', optionalAuth, getRecommendationsHandler);

// Incoming / Outgoing request management
router.get('/requests/incoming', requireAuth, getIncomingRequestsHandler);
router.get('/requests/outgoing', requireAuth, getOutgoingRequestsHandler);
router.post('/requests/:id/accept', requireAuth, acceptConnectionHandler);
router.post('/requests/:id/decline', requireAuth, declineConnectionHandler);

// Relationship status between current user and target peer
router.get('/status/:peerId', requireAuth, getConnectionStatusHandler);

// GET /api/match/:id - Retrieve specific student details
router.get('/:id', optionalAuth, getMatchByIdHandler);

// POST /api/match/request - Send match connection request
router.post('/request', requireAuth, requestConnectionHandler);

// POST /api/match/find - Run matching algorithm for current authenticated student
router.post('/find', requireAuth, findMatchHandler);

export default router;
