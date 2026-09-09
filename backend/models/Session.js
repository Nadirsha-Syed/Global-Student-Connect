import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    scheduledStartTime: {
      type: Date,
      required: [true, 'Scheduled start time is required'],
    },
    scheduledEndTime: {
      type: Date,
      required: [true, 'Scheduled end time is required'],
    },
    topic: {
      type: String,
      required: [true, 'Session topic is required'],
      trim: true,
    },
    roomId: {
      type: String,
      required: [true, 'Video room ID is required'],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
