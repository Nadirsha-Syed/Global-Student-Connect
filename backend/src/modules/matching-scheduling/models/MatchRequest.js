import mongoose from 'mongoose';

/**
 * MatchRequest Schema
 * Represents a student's intent to be paired for a study or discussion session.
 */
const preferredTimeSlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      description: '0 = Sunday, 1 = Monday, ..., 6 = Saturday (UTC)',
    },
    date: {
      type: Date,
      description: 'Optional specific date for non-recurring request',
    },
    startTime: {
      type: Number,
      min: 0,
      max: 1439,
      description: 'Start time in minutes from midnight UTC',
    },
    endTime: {
      type: Number,
      min: 0,
      max: 1440,
      description: 'End time in minutes from midnight UTC',
    },
  },
  { _id: false }
);

const matchRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for MatchRequest'],
      index: true,
    },
    topics: {
      type: [String],
      required: [true, 'At least one study topic or skill is required'],
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Please provide at least one topic or skill',
      },
    },
    preferredTimeSlots: {
      type: [preferredTimeSlotSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'cancelled'],
      default: 'pending',
      index: true,
    },
    matchedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    matchedSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      default: null,
    },
    aiCompatibilityBonus: {
      type: Number,
      default: 0,
      description: 'Hook for Member 5 (AI vector / ML compatibility score bonus)',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queue matching queries
matchRequestSchema.index({ status: 1, createdAt: -1 });
matchRequestSchema.index({ userId: 1, status: 1 });

const MatchRequest = mongoose.model('MatchRequest', matchRequestSchema);

export default MatchRequest;
