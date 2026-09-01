const express = require("express");
const config = require("./config/config");
const logger = require("./utils/logger");
const authController = require("./controllers/auth.controller");

// Middleware imports
const {
  corsMiddleware,
  rateLimit,
  securityHeaders,
  requestLogger,
} = require("./middleware/common.middleware");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/errorHandler.middleware");

// Routes imports
const authRoutes = require("./routes/auth.routes");
const studentsRoutes = require("./routes/students.routes");
const collegesRoutes = require("./routes/colleges.routes");

const app = express();

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

// Security & CORS
app.use(corsMiddleware);
app.use(securityHeaders);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api/", rateLimit());

// Request logging
app.use(requestLogger);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NPEPN Backend is running!",
    version: "1.0.0",
    environment: config.nodeEnv,
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.post("/api/login", authController.login);
app.use("/api/students", studentsRoutes);
app.use("/api/colleges", collegesRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ==========================================
// SERVER INITIALIZATION
// ==========================================

const startServer = () => {
  app.listen(config.port, () => {
    logger.success(
      `🚀 NPEPN Server running`,
      `http://localhost:${config.port}`,
    );
    logger.info(`📡 Environment: ${config.nodeEnv}`);
    logger.info(`🗄️  Database: ${config.database.database}`);
  });
};

module.exports = { app, startServer };
