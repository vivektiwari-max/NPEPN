const bcrypt = require("bcrypt");
const User = require("../models/User");
const Student = require("../models/Student");
const pool = require("../config/db");
const config = require("../config/config");
const { MESSAGES, STATUS_CODES } = require("../config/constants");
const validators = require("../utils/validators");
const logger = require("../utils/logger");

const studentsController = {
  // Register student
  register: async (req, res, next) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        degree,
        college,
        district,
        skills,
      } = req.body;

      // Validate required fields
      const validation = validators.validateRequiredFields(req.body, [
        "name",
        "email",
        "phone",
        "password",
        "degree",
        "college",
        "district",
        "skills",
      ]);
      if (!validation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: validation.error,
          },
        });
      }

      // Validate email
      const emailValidation = validators.validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: emailValidation.error,
          },
        });
      }

      // Validate phone
      const phoneValidation = validators.validatePhone(phone);
      if (!phoneValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: phoneValidation.error,
          },
        });
      }

      // Validate password
      const passwordValidation = validators.validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: passwordValidation.error,
          },
        });
      }

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(STATUS_CODES.CONFLICT).json({
          success: false,
          error: {
            message: MESSAGES.REGISTRATION.EMAIL_EXISTS,
          },
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(
        password,
        config.security.bcryptRounds,
      );

      // Start transaction
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // Create user
        const userResult = await client.query(
          `INSERT INTO users (email, password_hash, role)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [email, passwordHash, "student"],
        );

        const userId = userResult.rows[0].id;

        // Create student profile
        const studentResult = await client.query(
          `INSERT INTO students
           (name, email, phone, degree, college, district, skills)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [name, email, phone, degree, college, district, skills],
        );

        await client.query("COMMIT");

        logger.success("Student registered", email);

        res.status(STATUS_CODES.CREATED).json({
          success: true,
          message: MESSAGES.REGISTRATION.STUDENT_SUCCESS,
          student: studentResult.rows[0],
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Student registration error", error);

      if (error.code === "23505") {
        return res.status(STATUS_CODES.CONFLICT).json({
          success: false,
          error: {
            message: MESSAGES.REGISTRATION.EMAIL_EXISTS,
          },
        });
      }

      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.REGISTRATION.STUDENT_FAILED,
        },
      });
    }
  },

  // Get all students
  getAll: async (req, res, next) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const students = await Student.getAll(parseInt(limit), parseInt(offset));

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.FETCH.STUDENTS_SUCCESS,
        students,
      });
    } catch (error) {
      logger.error("Get all students error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.FETCH.STUDENTS_FAILED,
        },
      });
    }
  },

  // Get student profile
  getProfile: async (req, res, next) => {
    try {
      const email = req.query.email || req.user?.email;

      if (!email) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: "Email is required.",
          },
        });
      }

      const student = await Student.findByEmail(email);

      if (!student) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: {
            message: MESSAGES.FETCH.PROFILE_FAILED,
          },
        });
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.FETCH.PROFILE_SUCCESS,
        student,
      });
    } catch (error) {
      logger.error("Get student profile error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Update student profile
  updateProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = validators.trimData(req.body);

      const student = await Student.update(id, updateData);

      if (!student) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: {
            message: "Student not found.",
          },
        });
      }

      logger.success("Student profile updated", student.email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Student profile updated successfully",
        student,
      });
    } catch (error) {
      logger.error("Update student profile error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Delete student
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      await Student.delete(id);

      logger.success("Student deleted", id);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      logger.error("Delete student error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Search students by college
  searchByCollege: async (req, res, next) => {
    try {
      const { college, limit = 20 } = req.query;

      if (!college) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: "College name is required.",
          },
        });
      }

      const students = await Student.searchByCollege(college, parseInt(limit));

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        students,
      });
    } catch (error) {
      logger.error("Search students by college error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.FETCH.STUDENTS_FAILED,
        },
      });
    }
  },

  // Get students by district
  getByDistrict: async (req, res, next) => {
    try {
      const { district, limit = 20 } = req.query;

      if (!district) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: "District is required.",
          },
        });
      }

      const students = await Student.getByDistrict(district, parseInt(limit));

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        students,
      });
    } catch (error) {
      logger.error("Get students by district error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.FETCH.STUDENTS_FAILED,
        },
      });
    }
  },
};

module.exports = studentsController;
