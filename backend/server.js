const bcrypt = require("bcrypt");
const express = require("express");
const pool = require("../database/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../backend/.env" });

const app = express();

const PORT = 3000;

// JSON data receive karne ke liye
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("NPEPN Backend is running!");
});

// Student registration API
app.post("/api/students", async (req, res) => {
  const { name, email, phone, password, degree, college, district, skills } =
    req.body;

  // Server-side validation
  if (
    !name ||
    !email ||
    !phone ||
    !degree ||
    !college ||
    !district ||
    !skills
  ) {
    return res.status(400).json({
      message: "All student fields are required.",
    });
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  // Phone validation
  const phonePattern = /^[6-9]\d{9}$/;

  if (!phonePattern.test(phone)) {
    return res.status(400).json({
      message: "Please enter a valid 10-digit mobile number.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users
    (email, password_hash, role)
    VALUES ($1, $2, $3)`,
      [email, passwordHash, "student"],
    );
    const result = await pool.query(
      `INSERT INTO students
            (name, email, phone, degree, college, district, skills)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [name, email, phone, degree, college, district, skills],
    );

    res.status(201).json({
      message: "Student registered successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error.message);

    // Duplicate email
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    res.status(500).json({
      message: "Student registration failed.",
    });
  }
});
// College registration API

app.post("/api/colleges/register", async (req, res) => {
    let client;
     
  
    try{
        client = await pool.connect();
   
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
    college_id
  } = req.body;

  if (
    !institution_name ||
    !university ||
    !institutionType ||
    !affiliation ||
    !authorizedPerson ||
    !email ||
    !mobile ||
    !address ||
    !website ||
    !password ||
    !college_id
  ) {
    return res.status(400).json({
      message: "All college fields are required.",
    });
  }
  

  const existingUser = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      message: "This email  is already registered.",
    });
  }

  const existingCollege = await client.query(
    "SELECT * FROM college_profiles WHERE college_id = $1",
    [college_id],
  );
  if (existingCollege.rows.length > 0) {
    return res.status(409).json({
      message: "This college ID is already registered.",
    });
  }
   await client.query("BEGIN");
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await client.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3) RETURNING id `,
    [email, passwordHash, "college"],
  );
  const newCollege = await client.query(
    `INSERT INTO college_profiles
     (
     user_id,
     college_id,
     institution_name, 
     university,
     institution_type, 
     affiliation,
     authorized_person,
     mobile, 
     address,
     website 
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING * `,
    [
      newUser.rows[0].id,
      college_id,
      institution_name,
      university,
      institutionType,
      affiliation,
      authorizedPerson,
      mobile,
      address,
      website
      
    ],
  );
//   Transaction successful
  await client.query("COMMIT");


  return res.status(201).json({
    message: "College registered successfully",
    college: newCollege.rows[0],
  });

} catch (error){
    if(client) {
    await client.query("ROLLBACK");
    }
console.error("College registration error:", error);
return res.status(500).json({
    message:"College registration failed."
});

}

finally {
    if(client){
    client.release();
    }
}

});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id DESC");

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
});

// ===============================
// COLLEGE SEARCH API
// ===============================

app.get("/api/colleges", async (req, res) => {
  const { search, state, district } = req.query;

  try {
    let query = `
            SELECT id, college_name, state, district, city, college_type
            FROM colleges
            WHERE 1=1
        `;

    const values = [];
    let index = 1;

    // College search
    if (search && search.trim()) {
      const searchWords = search
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 1);

      searchWords.forEach((word) => {
        query += `
                    AND (
                        college_name ILIKE $${index}
                        OR state ILIKE $${index}
                        OR district ILIKE $${index}
                        OR city ILIKE $${index}
                    )
                `;

        values.push(`%${word}%`);
        index++;
      });
    }

    // State filter
    if (state) {
      query += ` AND state ILIKE $${index}`;
      values.push(state);
      index++;
    }

    // District filter
    if (district) {
      query += ` AND district ILIKE $${index}`;
      values.push(district);
      index++;
    }

    query += `
            ORDER BY college_name ASC
            LIMIT 100
        `;

    console.log("================================");
    console.log("SEARCH:", search);
    console.log("QUERY:", query);
    console.log("VALUES:", values);
    console.log("================================");

    const result = await pool.query(query, values);

    res.status(200).json({
      colleges: result.rows,
    });
  } catch (error) {
    console.error("College search error:", error.message);

    res.status(500).json({
      message: "Failed to fetch colleges.",
    });
  }
});
// ===============================
// STUDENT LOGIN API
// ===============================

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Required fields validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    // Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // Compare entered password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Login successful
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed.",
    });
  }
});
// Get logged-in student's profile
app.get("/api/students/profile", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, degree, college, district, skills
             FROM students
             WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    res.status(200).json({
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`NPEPN server running on http://localhost:${PORT}`);
});
