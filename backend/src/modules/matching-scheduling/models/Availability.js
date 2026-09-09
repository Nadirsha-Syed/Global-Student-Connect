import mongoose from 'mongoose';

/**
 * Availability Schema
 * Stores weekly recurring or date-specific open time windows for a student.
 * Times are stored in minutes from midnight UTC (0 to 1439) for fast interval calculations.
 */
const availabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for availability'],
      index: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      required: function () {
        return this.isRecurring;
      },
      description: '0 = Sunday, 1 = Monday, ..., 6 = Saturday (UTC)',
    },
    date: {
      type: Date,
      required: function () {
        return !this.isRecurring;
      },
      description: 'Specific UTC date for non-recurring availability',
    },
    startTime: {
      type: Number,
      required: [true, 'Start time in minutes from midnight UTC is required'],
      min: 0,
      max: 1439,
      description: 'Minutes from midnight UTC (e.g., 540 = 09:00 UTC)',
    },
    endTime: {
      type: Number,
      required: [true, 'End time in minutes from midnight UTC is required'],
      min: 0,
      max: 1440,
      validate: {
        validator: function (val) {
          return val > this.startTime;
        },
        message: 'End time must be strictly after start time',
      },
      description: 'Minutes from midnight UTC (e.g., 600 = 10:00 UTC)',
    },
    isRecurring: {
      type: Boolean,
      default: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for fast conflict checking & candidate filtering
availabilitySchema.index({ userId: 1, dayOfWeek: 1, isActive: 1 });
availabilitySchema.index({ userId: 1, date: 1, isActive: 1 });

/**
 * Utility helper: convert "HH:mm" time string into minutes from midnight.
 * Example: "09:30" -> 570
 */
availabilitySchema.statics.timeStringToMinutes = function (timeStr) {
  if (typeof timeStr === 'number') return timeStr;
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Utility helper: convert minutes from midnight into "HH:mm" UTC time string.
 * Example: 570 -> "09:30"
 */
availabilitySchema.statics.minutesToTimeString = function (minutes) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// Virtuals to return human-readable UTC times
availabilitySchema.virtual('startTimeFormatted').get(function () {
  return mongoose.model('Availability').minutesToTimeString(this.startTime);
});

availabilitySchema.virtual('endTimeFormatted').get(function () {
  return mongoose.model('Availability').minutesToTimeString(this.endTime);
});

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
