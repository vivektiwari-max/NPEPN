const config = require("../config/config");

const logger = {
  // Log information
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ℹ️  INFO: ${message}`, data || "");
  },

  // Log success
  success: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ SUCCESS: ${message}`, data || "");
  },

  // Log warnings
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ⚠️  WARN: ${message}`, data || "");
  },

  // Log errors
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ERROR: ${message}`);
    if (error) {
      console.error(`Details:`, error.message || error);
    }
  },

  // Log database queries (only in development)
  query: (query, params = null) => {
    if (config.nodeEnv === "development") {
      console.log(`[DATABASE QUERY]`, query);
      if (params) console.log(`[PARAMS]`, params);
    }
  },

  // Log API requests
  request: (method, path, statusCode) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${path} → ${statusCode}`);
  },

  // Log authentication events
  auth: (event, user, details = null) => {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] 🔐 AUTH: ${event} - User: ${user}`,
      details || "",
    );
  },
};

module.exports = logger;
