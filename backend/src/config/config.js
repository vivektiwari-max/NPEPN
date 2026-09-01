const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in backend/.env");
}

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database Configuration
  database: {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || process.env.DB_DATABASE || "npepn",
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || "1h",
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || "7d",
  },

  // API Configuration
  api: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    backendUrl: process.env.BACKEND_API_URL || "http://localhost:3000/api",
  },

  // Security Configuration
  security: {
    bcryptRounds: 10,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100,
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
};
