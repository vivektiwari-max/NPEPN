const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");
const { MESSAGES, STATUS_CODES } = require("../config/constants");
const validators = require("../utils/validators");
const logger = require("../utils/logger");

const authController = {
  // Login user
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: MESSAGES.VALIDATION.FIELDS_REQUIRED,
          },
        });
      }

      // Validate email format
      const emailValidation = validators.validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: emailValidation.error,
          },
        });
      }

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          error: {
            message: MESSAGES.AUTH.LOGIN_FAILED,
          },
        });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        logger.warn(`Failed login attempt for user: ${email}`);
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          error: {
            message: MESSAGES.AUTH.LOGIN_FAILED,
          },
        });
      }

      // Check if Admin has approved the account yet
      if (user.role !== 'admin' && user.role !== 'student' && user.approval_status === 'pending') {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          error: {
            message: "Approval pending. The admin has not verified your account yet.",
          },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.expire,
        },
      );

      logger.auth("Login successful", email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error("Login error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Logout user
  logout: async (req, res, next) => {
    try {
      logger.auth("Logout successful", req.user.email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      });
    } catch (error) {
      logger.error("Logout error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: {
            message: "User not found.",
          },
        });
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        user,
      });
    } catch (error) {
      logger.error("Get current user error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Verify token
  verifyToken: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        valid: true,
        user,
      });
    } catch (error) {
      logger.error("Token verification error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },
};

module.exports = authController;
