import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JWT token for authenticated student
 * @param {string} id - Student MongoDB ObjectId
 * @param {string} email - Student email address
 * @returns {string} JWT Token
 */
export const generateToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || 'global_student_connect_jwt_secret_dev',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Format sanitized student user profile object
 * Omits passwords and internal keys, computes dynamic profile completion percentage
 * @param {object} user - Student document
 * @returns {object} Formatted student profile
 */
export const formatUserProfile = (user) => {
  const completionScore = typeof user.calculateProfileCompletion === 'function'
    ? user.calculateProfileCompletion()
    : (() => {
        let score = 0;
        if (user.name && user.name.trim()) score += 15;
        if (user.country && user.country.trim()) score += 15;
        if (user.age !== undefined && user.age !== null) score += 10;
        if (user.gradeLevel && user.gradeLevel.trim()) score += 10;
        if (user.bio && user.bio.trim()) score += 15;
        if (Array.isArray(user.interests) && user.interests.length > 0) score += 15;
        if (Array.isArray(user.languages) && user.languages.length > 0) score += 10;
        if (user.profilePicture && user.profilePicture.trim()) score += 10;
        return Math.min(score, 100);
      })();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    country: user.country,
    timezone: user.timezone || 'UTC',
    age: user.age,
    gradeLevel: user.gradeLevel || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
    languages: user.languages || [],
    interests: user.interests || [],
    isProfileComplete: user.isProfileComplete !== undefined ? user.isProfileComplete : completionScore >= 80,
    profileCompletion: completionScore,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      country,
      timezone,
      age,
      gradeLevel,
      bio,
      profilePicture,
      languages,
      interests,
    } = req.body;

    // Validate required fields with defensive type checks
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (!country || typeof country !== 'string' || !country.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Country is required',
      });
    }

    // Check if student already exists
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email address already exists',
      });
    }

    // Format optional fields
    const resolvedGrade = gradeLevel !== undefined ? gradeLevel : (req.body.class || '');
    const resolvedLanguages = Array.isArray(languages)
      ? languages
      : (typeof languages === 'string' && languages.trim() ? [languages.trim()] : []);
    const resolvedInterests = Array.isArray(interests)
      ? interests
      : (typeof interests === 'string' && interests.trim() ? [interests.trim()] : []);

    // Create student user
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      country: country.trim(),
      timezone: typeof timezone === 'string' && timezone.trim() ? timezone.trim() : 'UTC',
      age: age !== undefined && age !== null && age !== '' ? Number(age) : undefined,
      gradeLevel: typeof resolvedGrade === 'string' ? resolvedGrade.trim() : String(resolvedGrade),
      bio: typeof bio === 'string' ? bio.trim() : '',
      profilePicture: typeof profilePicture === 'string' ? profilePicture.trim() : '',
      languages: resolvedLanguages,
      interests: resolvedInterests,
    });

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.email);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: formatUserProfile(newUser),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Authenticate student & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id.toString(), user.email);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserProfile(user),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get authenticated student profile
 * @route   GET /api/auth/profile
 * @access  Private (Student)
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view profile',
      });
    }

    // If req.user is already a fully populated user model instance
    if (req.user && req.user.name && req.user.email) {
      return res.status(200).json({
        success: true,
        user: formatUserProfile(req.user),
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUserProfile(user),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update authenticated student profile
 * @route   PUT /api/auth/profile
 * @access  Private (Student)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update profile',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const {
      name,
      country,
      timezone,
      age,
      gradeLevel,
      bio,
      profilePicture,
      languages,
      interests,
      isProfileComplete,
    } = req.body;

    // Validate and update fields with defensive type checks
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty',
        });
      }
      user.name = name.trim();
    }

    if (country !== undefined) {
      if (typeof country !== 'string' || !country.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Country cannot be empty',
        });
      }
      user.country = country.trim();
    }

    if (timezone !== undefined) {
      user.timezone = typeof timezone === 'string' && timezone.trim() ? timezone.trim() : 'UTC';
    }

    if (age !== undefined) {
      if (age === '' || age === null) {
        user.age = undefined;
      } else {
        const parsedAge = Number(age);
        if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid age between 5 and 120',
          });
        }
        user.age = parsedAge;
      }
    }

    const resolvedGrade = gradeLevel !== undefined ? gradeLevel : req.body.class;
    if (resolvedGrade !== undefined) {
      user.gradeLevel = typeof resolvedGrade === 'string' ? resolvedGrade.trim() : String(resolvedGrade);
    }

    if (bio !== undefined) {
      if (typeof bio !== 'string' || bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio cannot exceed 500 characters',
        });
      }
      user.bio = bio.trim();
    }

    if (profilePicture !== undefined) {
      user.profilePicture = typeof profilePicture === 'string' ? profilePicture.trim() : '';
    }

    if (languages !== undefined) {
      user.languages = Array.isArray(languages)
        ? languages
        : (typeof languages === 'string' && languages.trim() ? [languages.trim()] : []);
    }

    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests
        : (typeof interests === 'string' && interests.trim() ? [interests.trim()] : []);
    }

    // Auto-update isProfileComplete based on completion score if not explicitly passed
    const completionScore = typeof user.calculateProfileCompletion === 'function'
      ? user.calculateProfileCompletion()
      : (() => {
          let score = 0;
          if (user.name && user.name.trim()) score += 15;
          if (user.country && user.country.trim()) score += 15;
          if (user.age !== undefined && user.age !== null) score += 10;
          if (user.gradeLevel && user.gradeLevel.trim()) score += 10;
          if (user.bio && user.bio.trim()) score += 15;
          if (Array.isArray(user.interests) && user.interests.length > 0) score += 15;
          if (Array.isArray(user.languages) && user.languages.length > 0) score += 10;
          if (user.profilePicture && user.profilePicture.trim()) score += 10;
          return Math.min(score, 100);
        })();

    if (isProfileComplete !== undefined) {
      user.isProfileComplete = Boolean(isProfileComplete);
    } else {
      user.isProfileComplete = completionScore >= 80;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserProfile(updatedUser),
    });
  } catch (error) {
    return next(error);
  }
};
