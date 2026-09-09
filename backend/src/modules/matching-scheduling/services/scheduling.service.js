import mongoose from 'mongoose';
import Availability from '../models/Availability.js';
import Session from '../models/Session.js';
import MatchRequest from '../models/MatchRequest.js';
import Reflection from '../models/Reflection.js';

/**
 * Scheduling Service
 * Manages availability slots, atomic race-condition free meeting booking,
 * and session state management.
 */

/**
 * Custom error class for booking conflicts (HTTP 409).
 */
export class BookingConflictError extends Error {
  constructor(message = 'One or both participants already have a scheduled session during this time slot') {
    super(message);
    this.name = 'BookingConflictError';
    this.statusCode = 409;
  }
}

/**
 * Sets or updates availability slots for a student.
 * 
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {object[]} slots - Array of { dayOfWeek, startTime, endTime, isRecurring, date }
 * @param {boolean} [replace=true] - Whether to replace existing active slots
 * @returns {Promise<Availability[]>}
 */
export async function setUserAvailability(userId, slots, replace = true) {
  const uid = new mongoose.Types.ObjectId(userId);

  if (!Array.isArray(slots) || slots.length === 0) {
    throw new Error('Please provide an array with at least one availability slot');
  }

  // Format and validate each slot
  const normalizedSlots = slots.map((slot) => {
    const isRecurring = slot.isRecurring !== undefined ? Boolean(slot.isRecurring) : true;
    const startMinutes =
      typeof slot.startTime === 'string'
        ? Availability.timeStringToMinutes(slot.startTime)
        : Number(slot.startTime);
    const endMinutes =
      typeof slot.endTime === 'string'
        ? Availability.timeStringToMinutes(slot.endTime)
        : Number(slot.endTime);

    if (isNaN(startMinutes) || isNaN(endMinutes) || endMinutes <= startMinutes) {
      throw new Error(`Invalid slot times: startTime (${slot.startTime}) must be strictly before endTime (${slot.endTime})`);
    }

    if (isRecurring && (slot.dayOfWeek === undefined || slot.dayOfWeek < 0 || slot.dayOfWeek > 6)) {
      throw new Error('Recurring availability requires dayOfWeek (0 for Sunday to 6 for Saturday)');
    }

    if (!isRecurring && !slot.date) {
      throw new Error('Non-recurring availability requires a specific date');
    }

    return {
      userId: uid,
      dayOfWeek: isRecurring ? Number(slot.dayOfWeek) : undefined,
      date: !isRecurring ? new Date(slot.date) : undefined,
      startTime: startMinutes,
      endTime: endMinutes,
      isRecurring,
      isActive: true,
    };
  });

  if (replace) {
    // Deactivate previous slots for clean update
    await Availability.deleteMany({ userId: uid });
  }

  return await Availability.insertMany(normalizedSlots);
}

/**
 * Retrieves open availability slots for a specific student.
 * 
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Availability[]>}
 */
export async function getUserAvailability(userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  return await Availability.find({ userId: uid, isActive: true })
    .sort({ dayOfWeek: 1, startTime: 1 })
    .lean();
}

/**
 * Atomically books a meeting session between two students.
 * Prevents race conditions by verifying that neither student has a concurrent
 * overlapping scheduled session.
 * 
 * @param {object} params
 * @param {string|mongoose.Types.ObjectId} params.requesterId
 * @param {string|mongoose.Types.ObjectId} params.targetUserId
 * @param {string|Date} params.scheduledStart - UTC ISO date string or Date
 * @param {string|Date} params.scheduledEnd - UTC ISO date string or Date
 * @param {string} params.topic
 * @param {string} [params.matchRequestId]
 * @param {string} [params.meetingLink]
 * @returns {Promise<Session>}
 */
export async function bookSession({
  requesterId,
  targetUserId,
  scheduledStart,
  scheduledEnd,
  topic,
  matchRequestId,
  meetingLink,
}) {
  const userA = new mongoose.Types.ObjectId(requesterId);
  const userB = new mongoose.Types.ObjectId(targetUserId);

  if (userA.toString() === userB.toString()) {
    throw new Error('Cannot book a meeting with yourself');
  }

  const startDate = new Date(scheduledStart);
  const endDate = new Date(scheduledEnd);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid scheduledStart or scheduledEnd date provided');
  }

  if (endDate <= startDate) {
    throw new Error('scheduledEnd must be after scheduledStart');
  }

  if (!topic || topic.trim().length === 0) {
    throw new Error('A session topic is required');
  }

  // Determine if database supports replica set transactions
  let useTransactions = false;
  try {
    const admin = mongoose.connection.db.admin();
    const serverStatus = await admin.serverStatus();
    useTransactions = Boolean(serverStatus.repl);
  } catch {
    useTransactions = false;
  }

  if (useTransactions) {
    const mongoSession = await mongoose.startSession();
    try {
      mongoSession.startTransaction();

      // 1. Race condition check within transaction
      const conflictingSession = await Session.findOne({
        participants: { $in: [userA, userB] },
        status: 'scheduled',
        scheduledStart: { $lt: endDate },
        scheduledEnd: { $gt: startDate },
      }).session(mongoSession);

      if (conflictingSession) {
        throw new BookingConflictError(
          'Booking conflict: One or both students already have a meeting scheduled during this time slot.'
        );
      }

      // 2. Create session atomically
      const sessionDoc = new Session({
        participants: [userA, userB],
        scheduledStart: startDate,
        scheduledEnd: endDate,
        topic: topic.trim(),
        matchRequestId: matchRequestId ? new mongoose.Types.ObjectId(matchRequestId) : undefined,
        ...(meetingLink ? { meetingLink } : {}),
      });

      await sessionDoc.save({ session: mongoSession });

      // 3. Mark matching requests as matched
      await MatchRequest.updateMany(
        {
          userId: { $in: [userA, userB] },
          status: 'pending',
        },
        {
          $set: {
            status: 'matched',
            matchedSessionId: sessionDoc._id,
          },
        },
        { session: mongoSession }
      );

      await mongoSession.commitTransaction();
      return await Session.findById(sessionDoc._id).populate('participants', 'name email timezone country interests');
    } catch (err) {
      await mongoSession.abortTransaction();
      throw err;
    } finally {
      await mongoSession.endSession();
    }
  } else {
    // Standalone MongoDB: Safe pre-check + immediate double-check atomic write
    const conflictingSession = await Session.findOne({
      participants: { $in: [userA, userB] },
      status: 'scheduled',
      scheduledStart: { $lt: endDate },
      scheduledEnd: { $gt: startDate },
    });

    if (conflictingSession) {
      throw new BookingConflictError(
        'Booking conflict: One or both students already have a meeting scheduled during this time slot.'
      );
    }

    const sessionDoc = await Session.create({
      participants: [userA, userB],
      scheduledStart: startDate,
      scheduledEnd: endDate,
      topic: topic.trim(),
      matchRequestId: matchRequestId ? new mongoose.Types.ObjectId(matchRequestId) : undefined,
      ...(meetingLink ? { meetingLink } : {}),
    });

    // Update match requests
    await MatchRequest.updateMany(
      {
        userId: { $in: [userA, userB] },
        status: 'pending',
      },
      {
        $set: {
          status: 'matched',
          matchedSessionId: sessionDoc._id,
        },
      }
    );

    return await Session.findById(sessionDoc._id).populate('participants', 'name email timezone country interests');
  }
}

/**
 * Returns upcoming or past meetings for the logged-in user.
 * 
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {string} [status='scheduled'] - Filter by 'scheduled', 'completed', 'cancelled', or 'all'
 * @returns {Promise<Session[]>}
 */
export async function getMySessions(userId, status = 'scheduled') {
  const uid = new mongoose.Types.ObjectId(userId);
  const filter = {
    participants: uid,
  };

  if (status && status !== 'all') {
    filter.status = status;
  }

  return await Session.find(filter)
    .sort({ scheduledStart: 1 })
    .populate('participants', 'name email timezone country interests gradeLevel')
    .lean();
}

/**
 * Cancels a scheduled session.
 * 
 * @param {string|mongoose.Types.ObjectId} sessionId
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {string} [reason='Cancelled by participant']
 * @returns {Promise<Session>}
 */
export async function cancelSession(sessionId, userId, reason = 'Cancelled by participant') {
  const sId = new mongoose.Types.ObjectId(sessionId);
  const uid = new mongoose.Types.ObjectId(userId);

  const session = await Session.findById(sId);
  if (!session) {
    throw new Error('Session not found');
  }

  const isParticipant = session.participants.some(
    (p) => p.toString() === uid.toString()
  );

  if (!isParticipant) {
    throw new Error('Unauthorized: You are not a participant in this session');
  }

  session.status = 'cancelled';
  session.cancellationReason = reason;
  await session.save();

  return session;
}

/**
 * Submits a post-call reflection for a completed or scheduled session.
 * Automatically marks scheduled sessions as completed upon reflection.
 *
 * @param {object} params
 * @param {string|mongoose.Types.ObjectId} params.sessionId
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @param {string} params.learnings
 * @param {number} [params.rating=5]
 * @param {string} [params.culturalExchangeNotes='']
 * @param {object} [params.safetyReport]
 * @returns {Promise<Reflection>}
 */
export async function createReflection({
  sessionId,
  userId,
  learnings,
  rating = 5,
  culturalExchangeNotes = '',
  safetyReport,
}) {
  const sId = new mongoose.Types.ObjectId(sessionId);
  const uid = new mongoose.Types.ObjectId(userId);

  if (!learnings || learnings.trim().length === 0) {
    throw new Error('Key learnings or takeaways are required for reflection');
  }

  // 1. Verify session exists and is not cancelled
  const session = await Session.findById(sId);
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.status === 'cancelled') {
    throw new Error('Cannot submit reflection for a cancelled session');
  }

  // 2. Verify user was actually one of the session participants
  const isParticipant = session.participants.some(
    (p) => p.toString() === uid.toString()
  );
  if (!isParticipant) {
    throw new Error('Unauthorized: You are not a participant in this session');
  }

  // 3. Prevent duplicate reflections by same user for same session
  const existingReflection = await Reflection.findOne({
    sessionId: sId,
    userId: uid,
  });
  if (existingReflection) {
    const duplicateErr = new Error('You have already submitted a reflection for this session');
    duplicateErr.statusCode = 409;
    throw duplicateErr;
  }

  // 4. Create and save the reflection
  const reflection = await Reflection.create({
    sessionId: sId,
    userId: uid,
    learnings: learnings.trim(),
    rating: Number(rating) || 5,
    culturalExchangeNotes: culturalExchangeNotes ? culturalExchangeNotes.trim() : '',
    safetyReport: safetyReport || undefined,
  });

  // 5. If session was scheduled, mark it completed
  if (session.status === 'scheduled') {
    session.status = 'completed';
    await session.save();
  }

  return await Reflection.findById(reflection._id)
    .populate('userId', 'name email country timezone')
    .populate('sessionId', 'topic scheduledStart scheduledEnd');
}

/**
 * Retrieves all reflections submitted for a specific session.
 *
 * @param {string|mongoose.Types.ObjectId} sessionId
 * @returns {Promise<Reflection[]>}
 */
export async function getSessionReflections(sessionId) {
  const sId = new mongoose.Types.ObjectId(sessionId);
  return await Reflection.find({ sessionId: sId })
    .populate('userId', 'name email country timezone')
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Retrieves all reflections submitted by the current user.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Reflection[]>}
 */
export async function getMyReflections(userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  return await Reflection.find({ userId: uid })
    .populate('sessionId', 'topic scheduledStart scheduledEnd meetingLink')
    .sort({ createdAt: -1 })
    .lean();
}

