import mongoose from 'mongoose';

/**
 * Reflection Schema (Post-Call Reflection)
 * Stores peer feedback, key cultural insights, and learnings from a completed session.
 */
const reflectionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    learnings: {
      type: String,
      required: [true, 'Key learnings or cultural insights are required'],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    culturalExchangeNotes: {
      type: String,
      trim: true,
      default: '',
    },
    safetyReport: {
      flagged: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
        trim: true,
        default: '',
      },
      details: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward compatibility alias for submittedBy -> userId
reflectionSchema.virtual('submittedBy').get(function () {
  return this.userId;
}).set(function (val) {
  this.userId = val;
});

// Backward compatibility alias for feedback -> learnings
reflectionSchema.virtual('feedback').get(function () {
  return this.learnings;
}).set(function (val) {
  this.learnings = val;
});

// Compound uniqueness: A student cannot submit multiple reflections for the same session
reflectionSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

const Reflection = mongoose.model('Reflection', reflectionSchema);

export default Reflection;
