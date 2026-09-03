const bcrypt = require("bcrypt");
const User = require("../models/User");
const College = require("../models/College");
const pool = require("../config/db");
const config = require("../config/config");
const { MESSAGES, STATUS_CODES } = require("../config/constants");
const validators = require("../utils/validators");
const logger = require("../utils/logger");

const collegesController = {
  // Register college
  register: async (req, res, next) => {
    const client = await pool.connect();

    try {
      const {
        institution_name,
        university,
        institutionType,
        affiliation,
        authorizedPerson,
        email,
        mobile,
        address,
        website,
        password,
        college_id,
      } = req.body;

      // Validate required fields
      const validation = validators.validateRequiredFields(req.body, [
        "institution_name",
        "university",
        "institutionType",
        "affiliation",
        "authorizedPerson",
        "email",
        "mobile",
        "address",
        "website",
        "password",
        "college_id",
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
      const phoneValidation = validators.validatePhone(mobile);
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

      // Check if email exists
      const existingUser = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (existingUser.rows.length > 0) {
        client.release();
        return res.status(STATUS_CODES.CONFLICT).json({
          success: false,
          error: {
            message: MESSAGES.REGISTRATION.EMAIL_EXISTS,
          },
        });
      }

      // Check if college ID exists
      const existingCollege = await client.query(
        "SELECT id FROM college_profiles WHERE college_id = $1",
        [college_id],
      );
      if (existingCollege.rows.length > 0) {
        client.release();
        return res.status(STATUS_CODES.CONFLICT).json({
          success: false,
          error: {
            message: MESSAGES.REGISTRATION.COLLEGE_ID_EXISTS,
          },
        });
      }

      await client.query("BEGIN");

      // Hash password
      const passwordHash = await bcrypt.hash(
        password,
        config.security.bcryptRounds,
      );

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role, approval_status)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [email, passwordHash, 'college', 'pending'],
      );

      const userId = userResult.rows[0].id;

      // Create college profile
      const collegeResult = await client.query(
        `INSERT INTO college_profiles
         (user_id, college_id, institution_name, university, institution_type, 
          affiliation, authorized_person, mobile, address, website)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          userId,
          college_id,
          institution_name,
          university,
          institutionType,
          affiliation,
          authorizedPerson,
          mobile,
          address,
          website,
        ],
      );

      await client.query("COMMIT");

      logger.success("College registered", email);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.REGISTRATION.COLLEGE_SUCCESS,
        college: collegeResult.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("College registration error", error);

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
          message: MESSAGES.REGISTRATION.COLLEGE_FAILED,
        },
      });
    } finally {
      client.release();
    }
  },

  // Get all colleges
  getAll: async (req, res, next) => {
    try {
      const { limit = 100, offset = 0, search, state, district } = req.query;

      if (search || state || district) {
        const colleges = await College.search(search, state, district);
        return res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          message: MESSAGES.FETCH.COLLEGES_SUCCESS,
          colleges,
        });
      }

      const colleges = await College.getAll(parseInt(limit), parseInt(offset));

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.FETCH.COLLEGES_SUCCESS,
        colleges,
      });
    } catch (error) {
      logger.error("Get all colleges error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.FETCH.COLLEGES_FAILED,
        },
      });
    }
  },

  // Search colleges
  search: async (req, res, next) => {
    try {
      const { search, state, district } = req.query;
      const colleges = await College.search(search, state, district);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.FETCH.COLLEGES_SUCCESS,
        colleges,
      });
    } catch (error) {
      logger.error("Search colleges error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.FETCH.COLLEGES_FAILED,
        },
      });
    }
  },

  // Get college profile
  getProfile: async (req, res, next) => {
    try {
      const { college_id } = req.params;

      if (!college_id) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: {
            message: "College ID is required.",
          },
        });
      }

      const college = await College.findById(college_id);

      if (!college) {
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
        college,
      });
    } catch (error) {
      logger.error("Get college profile error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Update college profile
  updateProfile: async (req, res, next) => {
    try {
      const { college_id } = req.params;
      const updateData = validators.trimData(req.body);

      const college = await College.update(college_id, updateData);

      if (!college) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: {
            message: "College not found.",
          },
        });
      }

      logger.success("College profile updated", college_id);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "College profile updated successfully",
        college,
      });
    } catch (error) {
      logger.error("Update college profile error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },

  // Delete college
  delete: async (req, res, next) => {
    try {
      const { college_id } = req.params;

      await College.delete(college_id);

      logger.success("College deleted", college_id);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "College deleted successfully",
      });
    } catch (error) {
      logger.error("Delete college error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: {
          message: MESSAGES.SERVER.SOMETHING_WRONG,
        },
      });
    }
  },
};

module.exports = collegesController;
