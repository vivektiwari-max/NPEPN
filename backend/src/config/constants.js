// Regex Patterns
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  URL: /^https?:\/\/.+/i,
  COLLEGE_ID: /^[A-Z0-9]{1,20}$/,
};

// Error Messages
const MESSAGES = {
  // Validation Errors
  VALIDATION: {
    EMAIL_REQUIRED: "Email is required.",
    EMAIL_INVALID: "Please enter a valid email address.",
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_WEAK:
      "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
    PHONE_REQUIRED: "Phone number is required.",
    PHONE_INVALID: "Please enter a valid 10-digit mobile number.",
    FIELDS_REQUIRED: "All fields are required.",
    FIELD_REQUIRED: (field) => `${field} is required.`,
  },

  // Auth Messages
  AUTH: {
    LOGIN_SUCCESS: "Login successful!",
    LOGIN_FAILED: "Invalid email or password.",
    LOGOUT_SUCCESS: "Logout successful!",
    UNAUTHORIZED: "Unauthorized access.",
    TOKEN_EXPIRED: "Token has expired.",
    TOKEN_INVALID: "Invalid token.",
  },

  // Registration Messages
  REGISTRATION: {
    STUDENT_SUCCESS: "Student registered successfully",
    STUDENT_FAILED: "Student registration failed.",
    COLLEGE_SUCCESS: "College registered successfully",
    COLLEGE_FAILED: "College registration failed.",
    EMAIL_EXISTS: "This email is already registered.",
    COLLEGE_ID_EXISTS: "This college ID is already registered.",
  },

  // Fetch Messages
  FETCH: {
    STUDENTS_SUCCESS: "Students fetched successfully",
    STUDENTS_FAILED: "Failed to fetch students",
    COLLEGES_SUCCESS: "Colleges fetched successfully",
    COLLEGES_FAILED: "Failed to fetch colleges.",
    PROFILE_SUCCESS: "Profile fetched successfully",
    PROFILE_FAILED: "Profile not found.",
  },

  // Server Errors
  SERVER: {
    INTERNAL_ERROR: "Internal server error.",
    DB_ERROR: "Database error.",
    SOMETHING_WRONG: "Something went wrong. Please try again.",
  },
};

// HTTP Status Codes
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// User Roles
const ROLES = {
  STUDENT: "student",
  COLLEGE: "college",
  COMPANY: "company",
  DPC: "dpc",
  ADMIN: "admin",
};

// Pagination
const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

module.exports = {
  REGEX,
  MESSAGES,
  STATUS_CODES,
  ROLES,
  PAGINATION,
};
