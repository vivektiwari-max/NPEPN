const { STATUS_CODES, MESSAGES } = require("../config/constants");
const logger = require("../utils/logger");

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.path}`, err);

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      error: {
        message: err.message || MESSAGES.VALIDATION.FIELDS_REQUIRED,
        statusCode: STATUS_CODES.BAD_REQUEST,
      },
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      error: {
        message: MESSAGES.AUTH.TOKEN_INVALID,
        statusCode: STATUS_CODES.UNAUTHORIZED,
      },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      error: {
        message: MESSAGES.AUTH.TOKEN_EXPIRED,
        statusCode: STATUS_CODES.UNAUTHORIZED,
      },
    });
  }

  // Database errors
  if (err.code === "23505") {
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      error: {
        message: MESSAGES.REGISTRATION.EMAIL_EXISTS,
        statusCode: STATUS_CODES.CONFLICT,
      },
    });
  }

  // Default error
  const statusCode = err.statusCode || STATUS_CODES.SERVER_ERROR;
  const message = err.message || MESSAGES.SERVER.SOMETHING_WRONG;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    error: {
      message: "Route not found.",
      statusCode: STATUS_CODES.NOT_FOUND,
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
