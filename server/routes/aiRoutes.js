const express = require("express");
const axios = require("axios");
const router = express.Router();
const pool = require("../db"); // Make sure this exports your MySQL pool
require("dotenv").config();
// Google GenAI
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


router.post("/message", async (req, res) => {
  const { id } = req.body;
  console.log("GEMINI API KeY>> ",process.env.GEMINI_API_KEY);
  try {
    // Fetch student info from students and users
    const [studentResult] = await pool.query(`
      SELECT s.*, u.name, u.email, d.name AS department
      FROM student s
      JOIN users u ON s.user_id = u.id
      JOIN department d ON s.dept_id = d.id
      WHERE u.id = ?
    `, [id]);
    console.log("id mil ri>>",id);
    if (studentResult.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    const student = studentResult[0];

    // Fetch assignments for the student's year and department
    const [assignments] = await pool.query(`
      SELECT * FROM assignments
      WHERE year = ? AND branch = ?
    `, [student.year, student.department]);

    // Fetch upcoming seminars for the student
    const [seminars] = await pool.query(`
      SELECT * FROM seminars
      WHERE year = ? AND branch = ?
    `, [student.year, student.department]);

    // Fetch project reviews (optional but good to motivate)
    const [reviews] = await pool.query(`
      SELECT * FROM project_reviews
      WHERE year = ? AND branch = ? AND completed = 0
    `, [student.year, student.department]);
   
    // Prepare prompt
    const prompt = `
Student ${student.name} (PRN: ${student.prn}, Year ${student.year}, Department: ${student.department})

Pending Assignments:
${assignments.length > 0 ? assignments.map(a => `• ${a.title} (Due: ${new Date(a.deadline).toDateString()})`).join("\n") : "None"}

Upcoming Seminars:
${seminars.length > 0 ? seminars.map(s => `• ${s.title} (On: ${new Date(s.datetime).toDateString()})`).join("\n") : "None"}

Pending Project Reviews:
${reviews.length > 0 ? reviews.map(r => `• ${r.title} (Scheduled: ${new Date(r.date).toDateString()})`).join("\n") : "None"}

Write a short (max 100 words) statergic plan motiv message for this student.
`;

    // Call Gemini API
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const message = response.text().trim();

    res.status(200).json({ message });

  } catch (err) {
    console.error("❌ Error from Gemini API or DB:", err.message);
    res.status(500).json({ message: "AI message unavailable right now." });
  }
});

module.exports = router;
