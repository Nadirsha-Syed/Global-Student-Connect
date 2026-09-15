import mongoose from 'mongoose';
import {
  findBestMatch,
  createMatchRequest,
} from '../services/matching.service.js';
import User from '../../../../models/User.js';
import Match from '../../../../models/Match.js';
import {
  setUserAvailability,
  getUserAvailability,
  bookSession,
  getMySessions,
  cancelSession,
  BookingConflictError,
  createReflection,
  createDirectReflection,
  getSessionReflections,
  getMyReflections,
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

/**
 * POST /api/schedule/sessions/:sessionId/reflection
 * Submits a post-call reflection for a completed or scheduled session.
 */
export async function createReflectionHandler(req, res) {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;
    const { learnings, rating, culturalExchangeNotes, safetyReport } = req.body;

    const reflection = await createReflection({
      sessionId,
      userId,
      learnings,
      rating,
      culturalExchangeNotes,
      safetyReport,
    });

    return res.status(201).json({
      success: true,
      message: 'Reflection submitted successfully',
      data: reflection,
    });
  } catch (error) {
    if (error.statusCode === 409 || error.code === 11000 || error.message.includes('already submitted')) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: error.message || 'You have already submitted a reflection for this session',
      });
    }

    if (error.message.includes('Unauthorized') || error.message.includes('not a participant')) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
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
 * GET /api/schedule/sessions/:sessionId/reflection
 * Retrieves all reflections submitted for a specific session.
 */
export async function getSessionReflectionsHandler(req, res) {
  try {
    const { sessionId } = req.params;
    const reflections = await getSessionReflections(sessionId);

    return res.status(200).json({
      success: true,
      sessionId,
      count: reflections.length,
      data: reflections,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/schedule/reflections/my
 * Retrieves all reflections submitted by the logged-in student.
 */
export async function getMyReflectionsHandler(req, res) {
  try {
    const userId = req.userId;
    const reflections = await getMyReflections(userId);

    return res.status(200).json({
      success: true,
      count: reflections.length,
      data: reflections,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * POST /api/schedule/reflections
 * Submits a direct reflection journal entry for the logged-in student.
 */
export async function createDirectReflectionHandler(req, res) {
  try {
    const userId = req.userId;
    const {
      title,
      partnerName,
      partnerCountry,
      duration,
      tags,
      learnings,
      keyTakeaway,
      culturalExchangeNotes,
      culturalSurprise,
      rating,
    } = req.body;

    const finalLearnings = learnings || keyTakeaway;
    const reflection = await createDirectReflection({
      userId,
      title,
      partnerName,
      partnerCountry,
      duration,
      tags,
      learnings: finalLearnings,
      culturalExchangeNotes: culturalExchangeNotes || culturalSurprise,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: 'Cultural reflection logged successfully',
      data: reflection,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/match or /api/matches
 * Fetches matching peers directly from the real database User collection.
 * Excludes the logged-in user and computes dynamic compatibility score.
 */
export async function getAllMatchesHandler(req, res) {
  try {
    const currentUserId =
      req.userId ||
      req.headers['x-user-id'] ||
      req.query?.userId ||
      req.query?.excludeId;
    const currentUserEmail =
      req.userEmail ||
      req.headers['x-user-email'] ||
      req.query?.userEmail;

    let currentUser = null;
    if (currentUserId && mongoose.Types.ObjectId.isValid(currentUserId)) {
      currentUser = await User.findById(currentUserId).lean();
    } else if (currentUserEmail) {
      currentUser = await User.findOne({ email: currentUserEmail }).lean();
    }

    // Query real users from database, strictly excluding current student
    const allUsers = await User.find().select('-password').lean();
    const excludeId = (currentUser?._id || currentUserId || '').toString();
    const excludeEmail = (currentUser?.email || currentUserEmail || '').toLowerCase();

    const candidateUsers = allUsers.filter((u) => {
      const uId = u._id.toString();
      const uEmail = (u.email || '').toLowerCase();
      if (excludeId && uId === excludeId) return false;
      if (excludeEmail && uEmail === excludeEmail) return false;
      return true;
    });

    const formattedMatches = candidateUsers.map((u) => {
      const currentInterests = currentUser?.interests || [];
      const userInterests = u.interests || [];
      const sharedInterests = currentInterests.filter((i) =>
        userInterests.some((ui) => ui.toLowerCase() === i.toLowerCase())
      );

      // Calculate compatibility score based on shared interests & languages
      let matchScore = 85;
      if (sharedInterests.length >= 2) matchScore = 95;
      else if (sharedInterests.length === 1) matchScore = 90;

      const flag = u.country === 'Germany' ? '🇩🇪' : u.country === 'Japan' ? '🇯🇵' : '🌍';
      const avatar = u.country === 'Japan' ? '👨‍💻' : '👩‍🎓';

      return {
        id: u._id.toString(),
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        age: u.age || (u.country === 'Japan' ? 22 : 21),
        country: u.country,
        countryCode: u.country === 'Germany' ? 'DE' : u.country === 'Japan' ? 'JP' : 'UN',
        flag,
        educationLevel: u.gradeLevel || 'University',
        institution: u.gradeLevel || (u.country === 'Japan' ? 'Tokyo Institute of Technology' : 'Technical University of Munich'),
        matchScore,
        avatar,
        gallery: u.interests || [],
        interests: u.interests || [],
        sharedInterests: sharedInterests.length > 0 ? sharedInterests : (u.interests || []).slice(0, 2),
        languages: u.languages || [],
        bio: u.bio || '',
        verifiedStudent: true,
        timezone: u.timezone || 'UTC',
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedMatches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/match/recommendations
 * Top recommendations from real database users
 */
export async function getRecommendationsHandler(req, res) {
  return getAllMatchesHandler(req, res);
}

/**
 * GET /api/match/:id
 * Get single student profile by DB ID
 */
export async function getMatchByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }
    const flag = user.country === 'Germany' ? '🇩🇪' : user.country === 'Japan' ? '🇯🇵' : '🌍';
    const avatar = user.country === 'Japan' ? '👨‍💻' : '👩‍🎓';

    return res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        country: user.country,
        flag,
        avatar,
        age: user.age,
        educationLevel: user.gradeLevel || 'University',
        interests: user.interests || [],
        languages: user.languages || [],
        bio: user.bio || '',
        matchScore: 95,
        timezone: user.timezone || 'UTC',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/match/request
 * Send connection request to student
 */
export async function requestConnectionHandler(req, res) {
  try {
    const requesterId = req.userId;
    const { matchId } = req.body;
    if (!requesterId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    if (!matchId) {
      return res.status(400).json({ success: false, error: 'Target student ID is required' });
    }
    const match = await Match.findOneAndUpdate(
      { requesterId, receiverId: matchId },
      { status: 'pending', compatibilityScore: 95 },
      { upsert: true, new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Connection request sent successfully!',
      data: match,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/match/requests/incoming
 * Retrieves all pending connection requests sent to the logged-in student.
 */
export async function getIncomingRequestsHandler(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const requests = await Match.find({
      receiverId: userId,
      status: 'pending',
    })
      .populate('requesterId', 'name email country timezone age gradeLevel bio profilePicture languages interests')
      .sort({ updatedAt: -1 })
      .lean();

    const formattedRequests = requests
      .filter((r) => r.requesterId)
      .map((r) => {
        const u = r.requesterId;
        const flag = u.country === 'Germany' ? '🇩🇪' : u.country === 'Japan' ? '🇯🇵' : '🌍';
        const avatar = u.country === 'Japan' ? '👨‍💻' : '👩‍🎓';

        return {
          id: r._id.toString(),
          _id: r._id.toString(),
          requester: {
            id: u._id.toString(),
            _id: u._id.toString(),
            name: u.name,
            email: u.email,
            country: u.country,
            flag,
            avatar,
            age: u.age || 21,
            educationLevel: u.gradeLevel || 'University',
            institution: u.gradeLevel || (u.country === 'Germany' ? 'Technical University of Munich' : 'Tokyo Institute of Technology'),
            bio: u.bio || '',
            interests: u.interests || [],
            languages: u.languages || [],
            timezone: u.timezone || 'UTC',
          },
          status: r.status,
          compatibilityScore: r.compatibilityScore || 95,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      });

    return res.status(200).json({
      success: true,
      count: formattedRequests.length,
      data: formattedRequests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/match/requests/outgoing
 * Retrieves all requests sent by the logged-in student.
 */
export async function getOutgoingRequestsHandler(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const requests = await Match.find({ requesterId: userId })
      .populate('receiverId', 'name email country')
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/match/requests/:id/accept
 * Accepts an incoming connection request.
 */
export async function acceptConnectionHandler(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const match = await Match.findOne({
      _id: id,
      receiverId: userId,
    });

    if (!match) {
      return res.status(404).json({ success: false, error: 'Connection request not found' });
    }

    match.status = 'accepted';
    await match.save();

    return res.status(200).json({
      success: true,
      message: 'Connection accepted! You are now connected.',
      data: match,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/match/requests/:id/decline
 * Declines an incoming connection request.
 */
export async function declineConnectionHandler(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const match = await Match.findOne({
      _id: id,
      receiverId: userId,
    });

    if (!match) {
      return res.status(404).json({ success: false, error: 'Connection request not found' });
    }

    match.status = 'declined';
    await match.save();

    return res.status(200).json({
      success: true,
      message: 'Connection request declined.',
      data: match,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/match/status/:peerId
 * Returns relationship status between logged-in student and target peer.
 */
export async function getConnectionStatusHandler(req, res) {
  try {
    const userId = req.userId;
    const { peerId } = req.params;

    if (!userId) {
      return res.status(200).json({ success: true, status: 'none' });
    }

    // Check if current user sent request
    const outgoing = await Match.findOne({ requesterId: userId, receiverId: peerId });
    if (outgoing) {
      return res.status(200).json({
        success: true,
        status: outgoing.status === 'accepted' ? 'accepted' : 'outgoing_pending',
        matchId: outgoing._id,
      });
    }

    // Check if peer sent request to current user
    const incoming = await Match.findOne({ requesterId: peerId, receiverId: userId });
    if (incoming) {
      return res.status(200).json({
        success: true,
        status: incoming.status === 'accepted' ? 'accepted' : 'incoming_pending',
        matchId: incoming._id,
      });
    }

    return res.status(200).json({ success: true, status: 'none' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

