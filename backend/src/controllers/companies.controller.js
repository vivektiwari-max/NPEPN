const bcrypt = require("bcrypt");
const User = require("../models/User");
const Dpc = require("../models/Dpc");
const Company = require("../models/company");
const pool = require("../config/db");
const config = require("../config/config");
const { MESSAGES, STATUS_CODES } = require("../config/constants");
const validators = require("../utils/validators");
const logger = require("../utils/logger");

const companiesController = {
  register: async (req, res, next) => {
    try {
      const {
        companyName, companyType, industry, companyWebsite, companyEmail,
        officeAddress, state, district, pincode,
        representativeName, designation, officialMobile, alternateEmail,
        cinNumber, gstNumber, password,
      } = req.body;

      const validation = validators.validateRequiredFields(req.body, [
        "companyName", "companyType", "industry", "companyWebsite",
        "companyEmail", "officeAddress", "state", "district", "pincode",
        "representativeName", "designation", "officialMobile",
        "cinNumber", "password",
      ]);
      if (!validation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: { message: validation.error },
        });
      }

      const emailValidation = validators.validateEmail(companyEmail);
      if (!emailValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: { message: emailValidation.error },
        });
      }

      const phoneValidation = validators.validatePhone(officialMobile);
      if (!phoneValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: { message: phoneValidation.error },
        });
      }

      const passwordValidation = validators.validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: { message: passwordValidation.error },
        });
      }

      const existingUser = await User.findByEmail(companyEmail);
      if (existingUser) {
        return res.status(STATUS_CODES.CONFLICT).json({
          success: false,
          error: { message: MESSAGES.REGISTRATION.EMAIL_EXISTS },
        });
      }

      const passwordHash = await bcrypt.hash(
        password,
        config.security.bcryptRounds
      );

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const userResult = await client.query(
          `INSERT INTO users (email, password_hash, role, approval_status)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [companyEmail, passwordHash, 'company', 'pending']
        );

        const userId = userResult.rows[0].id;

        const companyResult = await client.query(
          `INSERT INTO company_profiles
           (user_id, company_name, company_type, industry, website, email,
            office_address, state, district, pincode,
            representative_name, designation, mobile, alternate_email,
            cin_number, gst_number)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           RETURNING *`,
          [
            userId, companyName, companyType, industry, companyWebsite,
            companyEmail, officeAddress, state, district, pincode,
            representativeName, designation, officialMobile,
            alternateEmail || null, cinNumber, gstNumber || null,
          ]
        );

        await client.query("COMMIT");

        logger.success("Company registered", companyEmail);

        res.status(STATUS_CODES.CREATED).json({
          success: true,
          message: "Company registered successfully.",
          company: companyResult.rows[0],
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Company registration error", error);

      if (error.code === "23505") {
        return res.status(STATUS_CODES.CONFLICT).json({
          success: false,
          error: { message: MESSAGES.REGISTRATION.EMAIL_EXISTS },
        });
      }

      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: { message: "Company registration failed." },
      });
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const companies = await Company.getAll(parseInt(limit), parseInt(offset));

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Companies fetched successfully.",
        companies,
      });
    } catch (error) {
      logger.error("Get all companies error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: { message: "Failed to fetch companies." },
      });
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const company = await Company.findByUserId(req.user.id);

      if (!company) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: { message: "Company profile not found." },
        });
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Company profile fetched successfully.",
        company,
      });
    } catch (error) {
      logger.error("Get company profile error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: { message: MESSAGES.SERVER.SOMETHING_WRONG },
      });
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingCompany = await Company.findById(id);

      if (!existingCompany) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: { message: "Company not found." },
        });
      }

      const isOwner = existingCompany.user_id === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          error: { message: "You do not have permission to update this profile." },
        });
      }

      const allowedFields = [
        "company_name", "company_type", "industry", "website",
        "office_address", "state", "district", "pincode",
        "representative_name", "designation", "mobile",
        "alternate_email", "cin_number", "gst_number",
      ];

      const trimmedData = validators.trimData(req.body);
      const updateData = {};

      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(trimmedData, field)) {
          updateData[field] = trimmedData[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: { message: "No valid fields provided for update." },
        });
      }

      const company = await Company.update(id, updateData);

      logger.success("Company profile updated", company.email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Company profile updated successfully.",
        company,
      });
    } catch (error) {
      logger.error("Update company profile error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: { message: MESSAGES.SERVER.SOMETHING_WRONG },
      });
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const company = await Company.findById(id);

      if (!company) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: { message: "Company not found." },
        });
      }

      const isOwner = company.user_id === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          error: { message: "You do not have permission to delete this company." },
        });
      }

      await Company.delete(id);

      logger.success("Company deleted", id);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Company deleted successfully.",
      });
    } catch (error) {
      logger.error("Delete company error", error);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        success: false,
        error: { message: MESSAGES.SERVER.SOMETHING_WRONG },
      });
    }
  },
};

module.exports = companiesController;
