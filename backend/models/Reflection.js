import mongoose from 'mongoose';

const reflectionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session ID is required'],
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitter user ID is required'],
    },
    feedback: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true,
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
  }
);

const Reflection = mongoose.model('Reflection', reflectionSchema);

export default Reflection;
