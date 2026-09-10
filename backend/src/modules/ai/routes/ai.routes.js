import { Router } from 'express';
import {
  getTopicSuggestions,
  getIcebreakers,
  getCompatibilityScore,
  summarizeSession,
} from '../controllers/ai.controller.js';

const router = Router();

// Member 5: AI Module Endpoints
router.post('/topics', getTopicSuggestions);
router.post('/icebreakers', getIcebreakers);
router.post('/compatibility', getCompatibilityScore);
router.post('/summarize', summarizeSession);

export default router;
