const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { MESSAGES, STATUS_CODES } = require("../config/constants");
const logger = require("../utils/logger");

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        error: {
          message: MESSAGES.AUTH.UNAUTHORIZED,
        },
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    logger.auth("Token verified", decoded.email);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn("Token expired", error.message);
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        error: {
          message: MESSAGES.AUTH.TOKEN_EXPIRED,
        },
      });
    }

    logger.error("Token verification failed", error);
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      error: {
        message: MESSAGES.AUTH.TOKEN_INVALID,
      },
    });
  }
};

// Check user role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        error: {
          message: MESSAGES.AUTH.UNAUTHORIZED,
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Access denied - insufficient role for ${req.user.email}`);
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        error: {
          message: "You do not have permission to access this resource.",
        },
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
};
