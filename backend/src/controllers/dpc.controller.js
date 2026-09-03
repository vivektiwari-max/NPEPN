const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Dpc = require("../models/Dpc");
const User = require("../models/User");
const config = require("../config/config"); // FIX: Updated correct config variables

const registerDpc = async (req, res, next) => {
  try {
    const {
      dpcName, district, state, pincode, address,
      officialEmail, officialMobile, landline, website,
      officerName, designation, officerEmail, officerMobile, password
    } = req.body;

    // 1. Check if DPC exists
    const existingDpc = await Dpc.findByEmail(officialEmail);
    if (existingDpc) {
      return res.status(400).json({ success: false, message: "A DPC with this official email is already registered" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save DPC
    const newDpcData = {
      dpcName, district, state, pincode, address, officialEmail, officialMobile,
      landline, website, officerName, designation, officerEmail, officerMobile, password: hashedPassword
    };

    const newDpc = await Dpc.create(newDpcData);

    res.status(201).json({
      success: true,
      message: "District Placement Cell registered successfully",
      dpcId: newDpc.id
    });
  } catch (error) {
    next(error); 
  }
};

const loginDpc = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find DPC
    const dpc = await Dpc.findByEmail(email);
    if (!dpc) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 2. Compare Password
    const isPasswordMatch = await bcrypt.compare(password, dpc.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check if Admin has approved the DPC account yet
    if (dpc.approval_status === 'pending') {
      return res.status(403).json({
          success: false,
          message: "Approval pending. Admin has not verified this DPC account yet."
      });
    }

    // 3. Generate JWT
    const payload = { id: dpc.id, role: "dpc", district: dpc.district };
    
    // FIX: Match exact jwt configurations of NPEPN backend
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        dpc: { id: dpc.id, dpcName: dpc.dpc_name, district: dpc.district, email: dpc.official_email }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerDpc, loginDpc };
