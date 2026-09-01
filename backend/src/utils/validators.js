const { REGEX, MESSAGES } = require("../config/constants");

const validators = {
  // Email validation
  isValidEmail: (email) => {
    return REGEX.EMAIL.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    return REGEX.PHONE.test(phone);
  },

  // Password validation
  isValidPassword: (password) => {
    return password && password.length >= 8;
  },

  // URL validation
  isValidURL: (url) => {
    return REGEX.URL.test(url);
  },

  // College ID validation
  isValidCollegeId: (collegeId) => {
    return REGEX.COLLEGE_ID.test(collegeId);
  },

  // Validate email format
  validateEmail: (email) => {
    if (!email) {
      return { valid: false, error: MESSAGES.VALIDATION.EMAIL_REQUIRED };
    }
    if (!validators.isValidEmail(email)) {
      return { valid: false, error: MESSAGES.VALIDATION.EMAIL_INVALID };
    }
    return { valid: true };
  },

  // Validate phone format
  validatePhone: (phone) => {
    if (!phone) {
      return { valid: false, error: MESSAGES.VALIDATION.PHONE_REQUIRED };
    }
    if (!validators.isValidPhone(phone)) {
      return { valid: false, error: MESSAGES.VALIDATION.PHONE_INVALID };
    }
    return { valid: true };
  },

  // Validate password
  validatePassword: (password) => {
    if (!password) {
      return { valid: false, error: MESSAGES.VALIDATION.PASSWORD_REQUIRED };
    }
    if (!validators.isValidPassword(password)) {
      return { valid: false, error: MESSAGES.VALIDATION.PASSWORD_WEAK };
    }
    return { valid: true };
  },

  // Validate required fields
  validateRequiredFields: (data, requiredFields) => {
    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        return {
          valid: false,
          error: MESSAGES.VALIDATION.FIELD_REQUIRED(field),
          field,
        };
      }
    }
    return { valid: true };
  },

  // Trim all string fields
  trimData: (obj) => {
    const trimmed = {};
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        trimmed[key] = obj[key].trim();
      } else {
        trimmed[key] = obj[key];
      }
    }
    return trimmed;
  },
};

module.exports = validators;
