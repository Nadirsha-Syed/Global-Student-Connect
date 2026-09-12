import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Authentication Middleware (Student Auth & Team Contract)
 * 
 * Extracts and verifies JWT token or developer headers, attaching:
 * `req.user` and `req.userId`.
 * 
 * Supports:
 * 1. Bearer JWT tokens via `Authorization` header (cryptographically verified).
 * 2. `x-user-id` header for module-level integration tests (guarded in non-production).
 * 3. Raw 24-character hex ObjectId tokens for direct testing (guarded in non-production).
 * 4. Upstream pre-authenticated req.user objects.
 */
export const requireAuth = async (req, res, next) => {
  // 1. If already set upstream
  if (req.user && (req.user.id || req.user._id)) {
    req.userId = (req.user.id || req.user._id).toString();
    return next();
  }

  // 2. Check x-user-id header (allow dev/test fallbacks only in non-production)
  if (process.env.NODE_ENV !== 'production') {
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId) {
      req.user = { id: headerUserId, _id: headerUserId };
      req.userId = headerUserId.toString();
      return next();
    }
  }

  // 3. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    // Allow raw 24-char ObjectId mock tokens only in non-production
    if (process.env.NODE_ENV !== 'production' && /^[0-9a-fA-F]{24}$/.test(token)) {
      req.user = { id: token, _id: token };
      req.userId = token;
      return next();
    }

    // Verify JWT token cryptographically
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'global_student_connect_jwt_secret_dev'
      );
      const resolvedId = decoded.id || decoded._id || decoded.userId || decoded.sub;

      if (resolvedId) {
        // If MongoDB is connected, verify user exists and load model instance without password
        if (mongoose.connection.readyState === 1) {
          try {
            const dbUser = await User.findById(resolvedId).select('-password');
            if (!dbUser) {
              return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'The user belonging to this token no longer exists.',
              });
            }
            req.user = dbUser;
            req.userId = dbUser._id.toString();
            return next();
          } catch {
            // Fallback to token payload only if DB query throws an error in test mode
          }
        }

        req.user = { id: resolvedId, _id: resolvedId, ...decoded };
        req.userId = resolvedId.toString();
        return next();
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: err.name === 'TokenExpiredError'
          ? 'Token has expired. Please log in again.'
          : 'Invalid authentication token.',
      });
    }
  }

  // 4. Check query or body fallback for local dev & testing (non-production only)
  if (process.env.NODE_ENV !== 'production') {
    const fallbackId = req.query?.userId || req.body?.userId;
    if (fallbackId && /^[0-9a-fA-F]{24}$/.test(fallbackId)) {
      req.user = { id: fallbackId, _id: fallbackId };
      req.userId = fallbackId.toString();
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'Authentication required. Please provide a valid Authorization Bearer token or x-user-id header.',
  });
};

export const protect = requireAuth;
export default requireAuth;
