/**
 * Authentication Middleware (Team Contract with Member 3)
 * 
 * Extracts and sets `req.user = { id: userId, _id: userId }`.
 * Integrates seamlessly with Member 3's JWT implementation:
 * - Reads Bearer token from `Authorization` header.
 * - Supports `x-user-id` header for direct module-level testing and microservice requests.
 */
export const requireAuth = (req, res, next) => {
  // 1. If already set upstream by Member 3's auth pipeline
  if (req.user && (req.user.id || req.user._id)) {
    req.userId = req.user.id || req.user._id;
    return next();
  }

  // 2. Check x-user-id header
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId) {
    req.user = { id: headerUserId, _id: headerUserId };
    req.userId = headerUserId;
    return next();
  }

  // 3. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    // If token is a 24-character hex MongoDB ObjectId (direct testing/mock token)
    if (/^[0-9a-fA-F]{24}$/.test(token)) {
      req.user = { id: token, _id: token };
      req.userId = token;
      return next();
    }

    // If Member 3 uses JWT, decode basic payload if available
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        const resolvedId = payload.id || payload._id || payload.userId || payload.sub;
        if (resolvedId) {
          req.user = { id: resolvedId, _id: resolvedId, ...payload };
          req.userId = resolvedId;
          return next();
        }
      }
    } catch {
      // Fall through to 401 if unparseable
    }
  }

  // 4. Check query or body fallback for local dev & testing
  const fallbackId = req.query?.userId || req.body?.userId;
  if (fallbackId && /^[0-9a-fA-F]{24}$/.test(fallbackId)) {
    req.user = { id: fallbackId, _id: fallbackId };
    req.userId = fallbackId;
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'Authentication required. Please provide a valid Authorization Bearer token or x-user-id header.',
  });
};

export default requireAuth;
