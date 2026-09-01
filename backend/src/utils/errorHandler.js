const { MESSAGES, STATUS_CODES } = require("../config/constants");

class AppError extends Error {
  constructor(message, statusCode = STATUS_CODES.SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

const errorHandler = {
  // Format error response
  formatError: (error, statusCode = STATUS_CODES.SERVER_ERROR) => {
    return {
      success: false,
      error: {
        code: error.code || "ERROR",
        message: error.message || MESSAGES.SERVER.SOMETHING_WRONG,
        statusCode,
        timestamp: new Date().toISOString(),
      },
    };
  },

  // Handle database errors
  handleDbError: (error) => {
    console.error("Database Error:", error);

    // Duplicate key error
    if (error.code === "23505") {
      return {
        statusCode: STATUS_CODES.CONFLICT,
        message: MESSAGES.REGISTRATION.EMAIL_EXISTS,
      };
    }

    // Foreign key constraint error
    if (error.code === "23503") {
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Invalid reference data.",
      };
    }

    // Unique constraint error
    if (error.code === "23514") {
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Constraint violation.",
      };
    }

    return {
      statusCode: STATUS_CODES.SERVER_ERROR,
      message: MESSAGES.SERVER.DB_ERROR,
    };
  },

  // Handle validation errors
  handleValidationError: (errors) => {
    const message = errors[0]?.msg || MESSAGES.VALIDATION.FIELDS_REQUIRED;
    return {
      statusCode: STATUS_CODES.BAD_REQUEST,
      message,
      errors: errors.map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    };
  },

  // Handle auth errors
  handleAuthError: (message = MESSAGES.AUTH.UNAUTHORIZED) => {
    return {
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message,
    };
  },

  // Handle 404 errors
  handleNotFoundError: (resource = "Resource") => {
    return {
      statusCode: STATUS_CODES.NOT_FOUND,
      message: `${resource} not found.`,
    };
  },

  // Generic error response
  sendErrorResponse: (
    res,
    error,
    defaultMessage = MESSAGES.SERVER.SOMETHING_WRONG,
  ) => {
    const statusCode = error.statusCode || STATUS_CODES.SERVER_ERROR;
    const message = error.message || defaultMessage;

    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
      },
    });
  },
};

module.exports = { AppError, errorHandler };
