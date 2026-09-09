import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester ID is required'],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled'],
      default: 'pending',
    },
    compatibilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    sharedInterests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate match requests between the same users
matchSchema.index({ requesterId: 1, receiverId: 1 }, { unique: true });

const Match = mongoose.model('Match', matchSchema);

export default Match;
