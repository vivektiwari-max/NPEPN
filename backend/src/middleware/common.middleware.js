const config = require("../config/config");
const logger = require("../utils/logger");

// CORS middleware
const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.cors.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

// Rate limiting middleware (simple in-memory implementation)
const rateLimitStore = new Map();

const rateLimit = (
  windowMs = config.security.rateLimitWindow,
  maxRequests = config.security.rateLimitMaxRequests,
) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, []);
    }

    const timestamps = rateLimitStore.get(ip);

    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        success: false,
        error: {
          message: "Too many requests. Please try again later.",
          retryAfter: Math.ceil(windowMs / 1000),
        },
      });
    }

    validTimestamps.push(now);
    rateLimitStore.set(ip, validTimestamps);
    next();
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.request(
      `${req.method} ${req.path}`,
      res.statusCode,
      `${duration}ms`,
    );
  });

  next();
};

module.exports = {
  corsMiddleware,
  rateLimit,
  securityHeaders,
  requestLogger,
};
