import mongoose from 'mongoose';
import Availability from '../models/Availability.js';
import MatchRequest from '../models/MatchRequest.js';
import Session from '../models/Session.js';
import User from '../../../../models/User.js';

/**
 * Matching Algorithm Service
 * Implements Member 4's matching engine with hookable AI compatibility score support for Member 5.
 */

/**
 * Checks whether two time intervals overlap.
 * @param {number} startA - Minutes from midnight
 * @param {number} endA - Minutes from midnight
 * @param {number} startB - Minutes from midnight
 * @param {number} endB - Minutes from midnight
 * @returns {{ overlaps: boolean, overlapStart?: number, overlapEnd?: number }}
 */
export function calculateTimeOverlap(startA, endA, startB, endB, minDurationMinutes = 30) {
  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);

  if (overlapEnd - overlapStart >= minDurationMinutes) {
    return {
      overlaps: true,
      overlapStart,
      overlapEnd,
      duration: overlapEnd - overlapStart,
    };
  }

  return { overlaps: false };
}

/**
 * Finds the best matching peer for a candidate user.
 * 
 * Algorithm:
 * 1. Exclude the candidate user.
 * 2. Fetch candidate topics & availability (from params or active MatchRequest / User model).
 * 3. Find candidates with overlapping availability blocks.
 * 4. Compute composite score:
 *    - Subject/Topic match overlap weight: +50
 *    - Same available time block weight: +30
 *    - AI compatibility bonus (hook for Member 5): +aiCompatibilityBonus
 * 5. Return the highest-scoring match with overlapping slot details.
 * 
 * @param {string|mongoose.Types.ObjectId} candidateUserId
 * @param {object} [options]
 * @param {string[]} [options.topics] - Override topics
 * @param {object[]} [options.preferredTimeSlots] - Override slots
 * @param {number} [options.aiCompatibilityBonus=0] - Static AI bonus from Member 5
 * @param {Function} [options.aiHook] - Async function (candidate, peer, sharedTopics) => Promise<number>
 * @returns {Promise<object|null>}
 */
export async function findBestMatch(candidateUserId, options = {}) {
  const candidateId = new mongoose.Types.ObjectId(candidateUserId);

  // 1. Resolve Candidate Profile, Topics, and Availability
  const candidateUser = await User.findById(candidateId).lean();
  if (!candidateUser) {
    throw new Error(`Candidate user ${candidateUserId} not found`);
  }

  // Active match request or manual override
  const activeCandidateRequest = await MatchRequest.findOne({
    userId: candidateId,
    status: 'pending',
  }).sort({ createdAt: -1 }).lean();

  const candidateTopics = (
    options.topics ||
    activeCandidateRequest?.topics ||
    candidateUser.interests ||
    []
  ).map((t) => t.trim().toLowerCase());

  // Candidate availability slots
  let candidateSlots = [];
  if (options.preferredTimeSlots && options.preferredTimeSlots.length > 0) {
    candidateSlots = options.preferredTimeSlots;
  } else if (activeCandidateRequest?.preferredTimeSlots?.length > 0) {
    candidateSlots = activeCandidateRequest.preferredTimeSlots;
  } else {
    candidateSlots = await Availability.find({
      userId: candidateId,
      isActive: true,
    }).lean();
  }

  // 2. Fetch Pool of Potential Candidates (exclude self)
  // Check active MatchRequests first, fallback to all users with active availability
  const pendingRequests = await MatchRequest.find({
    userId: { $ne: candidateId },
    status: 'pending',
  })
    .populate('userId', 'name email country timezone interests languages gradeLevel')
    .lean();

  const candidatePoolMap = new Map();

  for (const req of pendingRequests) {
    if (!req.userId) continue;
    const peerIdStr = req.userId._id.toString();
    candidatePoolMap.set(peerIdStr, {
      user: req.userId,
      matchRequest: req,
      topics: req.topics || req.userId.interests || [],
    });
  }

  // If pool is small, supplement with all other users who have active availability
  const otherUsersWithAvailability = await Availability.find({
    userId: { $ne: candidateId },
    isActive: true,
  })
    .populate('userId', 'name email country timezone interests languages gradeLevel')
    .lean();

  for (const avail of otherUsersWithAvailability) {
    if (!avail.userId) continue;
    const peerIdStr = avail.userId._id.toString();
    if (!candidatePoolMap.has(peerIdStr)) {
      candidatePoolMap.set(peerIdStr, {
        user: avail.userId,
        matchRequest: null,
        topics: avail.userId.interests || [],
      });
    }
  }

  if (candidatePoolMap.size === 0) {
    return null; // No other candidates available in the system
  }

  const scoredMatches = [];

  // 3. Evaluate each candidate
  for (const [peerIdStr, candidateData] of candidatePoolMap.entries()) {
    const peerUser = candidateData.user;
    const peerTopics = (candidateData.topics || []).map((t) => t.trim().toLowerCase());

    // A. Check for Subject/Topic Match Overlap (+50)
    const sharedTopics = candidateTopics.filter((topic) =>
      peerTopics.includes(topic)
    );
    const hasTopicMatch = sharedTopics.length > 0;
    const topicScore = hasTopicMatch ? 50 : 0;

    // B. Fetch Peer Availability Blocks
    let peerSlots = [];
    if (candidateData.matchRequest?.preferredTimeSlots?.length > 0) {
      peerSlots = candidateData.matchRequest.preferredTimeSlots;
    } else {
      peerSlots = await Availability.find({
        userId: peerUser._id,
        isActive: true,
      }).lean();
    }

    // Find best overlapping time block (+30)
    let bestOverlap = null;
    for (const cSlot of candidateSlots) {
      for (const pSlot of peerSlots) {
        // Compare same day of week (recurring) or same specific date
        const sameDay =
          cSlot.dayOfWeek !== undefined &&
          pSlot.dayOfWeek !== undefined &&
          cSlot.dayOfWeek === pSlot.dayOfWeek;

        const sameDate =
          cSlot.date &&
          pSlot.date &&
          new Date(cSlot.date).toISOString().slice(0, 10) ===
            new Date(pSlot.date).toISOString().slice(0, 10);

        if (sameDay || sameDate) {
          const overlap = calculateTimeOverlap(
            cSlot.startTime,
            cSlot.endTime,
            pSlot.startTime,
            pSlot.endTime,
            30 // Minimum meeting duration: 30 minutes
          );

          if (overlap.overlaps) {
            bestOverlap = {
              dayOfWeek: cSlot.dayOfWeek ?? pSlot.dayOfWeek,
              date: cSlot.date || pSlot.date || null,
              startTime: overlap.overlapStart,
              endTime: overlap.overlapEnd,
              duration: overlap.duration,
              startTimeFormatted: Availability.minutesToTimeString(overlap.overlapStart),
              endTimeFormatted: Availability.minutesToTimeString(overlap.overlapEnd),
            };
            break;
          }
        }
      }
      if (bestOverlap) break;
    }

    const hasTimeOverlap = Boolean(bestOverlap);
    const timeScore = hasTimeOverlap ? 30 : 0;

    // Must have at least a topic overlap OR an overlapping time slot to qualify
    if (!hasTopicMatch && !hasTimeOverlap) {
      continue;
    }

    // C. AI Compatibility Bonus Hook (Member 5 contract)
    let aiBonus = options.aiCompatibilityBonus || 0;
    if (typeof options.aiHook === 'function') {
      try {
        const dynamicBonus = await options.aiHook(candidateUser, peerUser, sharedTopics);
        if (typeof dynamicBonus === 'number') {
          aiBonus += dynamicBonus;
        }
      } catch (hookErr) {
        console.warn('AI Compatibility Hook warning:', hookErr.message);
      }
    }

    // Composite Score Calculation
    const totalScore = topicScore + timeScore + aiBonus;

    scoredMatches.push({
      matchedUser: {
        _id: peerUser._id,
        name: peerUser.name,
        email: peerUser.email,
        country: peerUser.country,
        timezone: peerUser.timezone,
        interests: peerUser.interests,
        gradeLevel: peerUser.gradeLevel,
      },
      matchRequestId: candidateData.matchRequest?._id || null,
      score: totalScore,
      scoreBreakdown: {
        topicScore,
        timeScore,
        aiBonus,
        total: totalScore,
      },
      sharedTopics,
      overlappingSlot: bestOverlap,
    });
  }

  if (scoredMatches.length === 0) {
    return null;
  }

  // 4. Sort descending by highest score and return top match
  scoredMatches.sort((a, b) => b.score - a.score);

  return scoredMatches[0];
}

/**
 * Creates or updates an active MatchRequest queue item.
 */
export async function createMatchRequest(userId, { topics, preferredTimeSlots, aiCompatibilityBonus = 0 }) {
  // If user already has a pending request, update it
  let request = await MatchRequest.findOne({ userId, status: 'pending' });

  if (request) {
    request.topics = topics || request.topics;
    if (preferredTimeSlots) request.preferredTimeSlots = preferredTimeSlots;
    if (aiCompatibilityBonus) request.aiCompatibilityBonus = aiCompatibilityBonus;
    await request.save();
  } else {
    request = await MatchRequest.create({
      userId,
      topics,
      preferredTimeSlots: preferredTimeSlots || [],
      aiCompatibilityBonus,
      status: 'pending',
    });
  }

  return request;
}
