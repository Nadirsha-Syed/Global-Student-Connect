import mongoose from 'mongoose';
import User from '../../../../models/User.js';
import Session from '../../matching-scheduling/models/Session.js';
import Reflection from '../../matching-scheduling/models/Reflection.js';
import {
  generateTopicSuggestions,
  generateIcebreakers,
  computeCompatibilityBonus,
  summarizeReflections,
} from '../services/ai.service.js';

/**
 * Helper to resolve user object from DB if ID is provided, otherwise fallback to provided payload.
 */
async function resolveUser(userInput) {
  if (!userInput) return {};
  if (typeof userInput === 'string' && mongoose.Types.ObjectId.isValid(userInput)) {
    const user = await User.findById(userInput).lean();
    return user || {};
  }
  if (userInput._id && mongoose.Types.ObjectId.isValid(userInput._id)) {
    const user = await User.findById(userInput._id).lean();
    return user || userInput;
  }
  return userInput;
}

/**
 * Controller: Generate tailored discussion topics and agenda
 * POST /api/ai/topics
 */
export async function getTopicSuggestions(req, res, next) {
  try {
    const { userAId, userBId, userA, userB, topic } = req.body;

    const resolvedA = await resolveUser(userAId || userA);
    const resolvedB = await resolveUser(userBId || userB);

    const result = await generateTopicSuggestions({
      userA: resolvedA,
      userB: resolvedB,
      baseTopic: topic || 'Collaborative Peer Study',
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: Generate cross-cultural icebreakers for video sessions
 * POST /api/ai/icebreakers
 */
export async function getIcebreakers(req, res, next) {
  try {
    const { userAId, userBId, userA, userB } = req.body;

    const resolvedA = await resolveUser(userAId || userA);
    const resolvedB = await resolveUser(userBId || userB);

    const result = await generateIcebreakers({
      userA: resolvedA,
      userB: resolvedB,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: Compute dynamic AI compatibility bonus between two students
 * POST /api/ai/compatibility
 */
export async function getCompatibilityScore(req, res, next) {
  try {
    const { userAId, userBId, userA, userB, sharedTopics = [] } = req.body;

    const resolvedA = await resolveUser(userAId || userA);
    const resolvedB = await resolveUser(userBId || userB);

    const bonus = await computeCompatibilityBonus(resolvedA, resolvedB, sharedTopics);

    return res.status(200).json({
      success: true,
      data: {
        compatibilityBonus: bonus,
        candidate: { name: resolvedA.name, country: resolvedA.country },
        peer: { name: resolvedB.name, country: resolvedB.country },
        sharedTopics,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: Summarize session reflections and feedback
 * POST /api/ai/summarize
 */
export async function summarizeSession(req, res, next) {
  try {
    const { sessionId, session, reflections } = req.body;

    let targetSession = session || {};
    let targetReflections = reflections || [];

    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      if (!session) {
        targetSession = (await Session.findById(sessionId).lean()) || {};
      }
      if (!reflections) {
        targetReflections = (await Reflection.find({ sessionId }).populate('userId', 'name country').lean()) || [];
      }
    }

    const result = await summarizeReflections({
      session: targetSession,
      reflections: targetReflections,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
