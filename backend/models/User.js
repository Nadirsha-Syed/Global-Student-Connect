import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    timezone: {
      type: String,
      required: [true, 'Timezone is required'],
      trim: true,
      default: 'UTC',
    },
    age: {
      type: Number,
    },
    gradeLevel: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    profilePicture: {
      type: String,
      trim: true,
      default: '',
    },
    languages: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook: hash password if new or modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate dynamic profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  if (this.name && this.name.trim()) score += 15;
  if (this.country && this.country.trim()) score += 15;
  if (this.age !== undefined && this.age !== null) score += 10;
  if (this.gradeLevel && this.gradeLevel.trim()) score += 10;
  if (this.bio && this.bio.trim()) score += 15;
  if (Array.isArray(this.interests) && this.interests.length > 0) score += 15;
  if (Array.isArray(this.languages) && this.languages.length > 0) score += 10;
  if (this.profilePicture && this.profilePicture.trim()) score += 10;
  return Math.min(score, 100);
};

const User = mongoose.model('User', userSchema);

export default User;
