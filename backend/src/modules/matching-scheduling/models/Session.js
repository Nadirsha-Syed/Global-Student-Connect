import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

/**
 * Session Schema (Meeting)
 * Represents a confirmed, scheduled video study/discussion meeting between two students.
 */
const sessionSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length === 2 && val[0].toString() !== val[1].toString();
        },
        message: 'A session must have exactly two distinct participant user IDs',
      },
    },
    scheduledStart: {
      type: Date,
      required: [true, 'Scheduled start date/time (UTC) is required'],
      index: true,
    },
    scheduledEnd: {
      type: Date,
      required: [true, 'Scheduled end date/time (UTC) is required'],
      index: true,
      validate: {
        validator: function (val) {
          return val > this.scheduledStart;
        },
        message: 'Scheduled end time must be after scheduled start time',
      },
    },
    topic: {
      type: String,
      required: [true, 'Session topic is required'],
      trim: true,
    },
    meetingLink: {
      type: String,
      default: function () {
        const roomId = randomUUID();
        return `https://meet.globalstudentconnect.internal/room/${roomId}`;
      },
      trim: true,
    },
    roomId: {
      type: String,
      default: function () {
        return randomUUID();
      },
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
    matchRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MatchRequest',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward-compatibility aliases with earlier schema
sessionSchema.virtual('scheduledStartTime').get(function () {
  return this.scheduledStart;
}).set(function (val) {
  this.scheduledStart = val;
});

sessionSchema.virtual('scheduledEndTime').get(function () {
  return this.scheduledEnd;
}).set(function (val) {
  this.scheduledEnd = val;
});

// Critical compound indexes for fast conflict detection and user session queries
sessionSchema.index({ participants: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 });
sessionSchema.index({ participants: 1, status: 1, scheduledStart: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
