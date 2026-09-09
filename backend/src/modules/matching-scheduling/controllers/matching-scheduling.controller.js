import {
  findBestMatch,
  createMatchRequest,
} from '../services/matching.service.js';
import {
  setUserAvailability,
  getUserAvailability,
  bookSession,
  getMySessions,
  cancelSession,
  BookingConflictError,
} from '../services/scheduling.service.js';

/**
 * Controller for Matching and Scheduling Module
 */

/**
 * POST /api/schedule/availability
 * Sets or updates availability slots for the logged-in student.
 */
export async function setAvailabilityHandler(req, res) {
  try {
    const userId = req.userId;
    const slots = Array.isArray(req.body.slots)
      ? req.body.slots
      : Array.isArray(req.body)
      ? req.body
      : [req.body];

    const updatedSlots = await setUserAvailability(userId, slots);

    return res.status(200).json({
      success: true,
      message: 'Availability slots updated successfully',
      count: updatedSlots.length,
      data: updatedSlots,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/schedule/availability/:userId
 * Retrieves open availability slots for a target student.
 */
export async function getAvailabilityHandler(req, res) {
  try {
    const { userId } = req.params;
    const slots = await getUserAvailability(userId);

    return res.status(200).json({
      success: true,
      userId,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * POST /api/match/find
 * Runs the matching algorithm for the logged-in student.
 * Optional body: { topics, preferredTimeSlots, aiCompatibilityBonus }
 */
export async function findMatchHandler(req, res) {
  try {
    const userId = req.userId;
    const { topics, preferredTimeSlots, aiCompatibilityBonus } = req.body;

    // Optional: save to queue if explicit topics were provided
    if (topics && topics.length > 0) {
      await createMatchRequest(userId, {
        topics,
        preferredTimeSlots,
        aiCompatibilityBonus,
      });
    }

    const match = await findBestMatch(userId, {
      topics,
      preferredTimeSlots,
      aiCompatibilityBonus: Number(aiCompatibilityBonus) || 0,
    });

    if (!match) {
      return res.status(200).json({
        success: true,
        match: null,
        message: 'No compatible peer match found at this time. Try adding more availability or broadening your topics.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Best match found successfully',
      data: match,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * POST /api/schedule/book
 * Atomically confirms a slot and books the meeting session.
 * Body: { targetUserId, scheduledStart, scheduledEnd, topic, matchRequestId, meetingLink }
 */
export async function bookSessionHandler(req, res) {
  try {
    const requesterId = req.userId;
    const {
      targetUserId,
      scheduledStart,
      scheduledEnd,
      topic,
      matchRequestId,
      meetingLink,
    } = req.body;

    if (!targetUserId || !scheduledStart || !scheduledEnd || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields: targetUserId, scheduledStart, scheduledEnd, and topic are required.',
      });
    }

    const session = await bookSession({
      requesterId,
      targetUserId,
      scheduledStart,
      scheduledEnd,
      topic,
      matchRequestId,
      meetingLink,
    });

    return res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully',
      data: session,
    });
  } catch (error) {
    if (error instanceof BookingConflictError || error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/schedule/sessions/my
 * Retrieves upcoming or past sessions for the logged-in student.
 */
export async function getMySessionsHandler(req, res) {
  try {
    const userId = req.userId;
    const status = req.query.status || 'scheduled';

    const sessions = await getMySessions(userId, status);

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * PATCH /api/schedule/sessions/:sessionId/cancel
 * Cancels a scheduled session.
 */
export async function cancelSessionHandler(req, res) {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;
    const { reason } = req.body;

    const session = await cancelSession(sessionId, userId, reason);

    return res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      data: session,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}
