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
      languages,
      interests,
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!email || !email.trim()) {
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

    if (!password) {
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

    if (!country || !country.trim()) {
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
      timezone: timezone && timezone.trim() ? timezone.trim() : 'UTC',
      age: age !== undefined && age !== null && age !== '' ? Number(age) : undefined,
      gradeLevel: typeof resolvedGrade === 'string' ? resolvedGrade.trim() : String(resolvedGrade),
      languages: resolvedLanguages,
      interests: resolvedInterests,
    });

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.email);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        country: newUser.country,
        timezone: newUser.timezone,
        age: newUser.age,
        gradeLevel: newUser.gradeLevel,
        languages: newUser.languages,
        interests: newUser.interests,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
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

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!password) {
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        timezone: user.timezone,
        age: user.age,
        gradeLevel: user.gradeLevel,
        languages: user.languages,
        interests: user.interests,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

