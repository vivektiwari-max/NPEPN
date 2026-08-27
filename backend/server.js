const express = require("express");
const pool = require("../database/db");

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

    const {
        name,
        email,
        phone,
        degree,
        college,
        district,
        skills
    } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO students
            (name, email, phone, degree, college, district, skills)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [name, email, phone, degree, college, district, skills]
        );

        res.status(201).json({
            message: "Student registered successfully",
            student: result.rows[0]
        });

    }  catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
        message: "Student registration failed."
    });
}
});
// Get all students
app.get("/api/students", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM students ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            message: "Failed to fetch students"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`NPEPN server running on http://localhost:${PORT}`);
});