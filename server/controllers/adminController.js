const db = require('../db');
const bcrypt=require('bcrypt');
const { get } = require('../routes/authRoutes');

const addDepartment = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Department name required' });

    const sql = 'INSERT INTO department (name) VALUES (?)';

    db.query(sql, [name], (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
           return res.status(409).json({ error: 'Department already exists' });
        }
     return res.status(500).json({ error: `Database error >> ${err.message}` });
     }
    res.status(201).json({ message: 'Department added successfully', deptId: result.insertId });
   });
};


const addStudent = async (req, res) => {
  try {
    const { name, email, password, prn, dept_id, division, year } = req.body;
    const role = 'student';

    if (!name || !email || !password || !prn || !dept_id || !division || !year) {
      return res.status(400).json({
        error: 'name, email, password, prn, dept_id, division, year are required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, role, hashedPassword], (err, userResult) => {
      if (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: `Error inserting into users table => ${err.message}` });
      }

      const userId = userResult.insertId;

      const stdsql = 'INSERT INTO student (prn, user_id, division, dept_id, year) VALUES (?, ?, ?, ?, ?)';
      db.query(stdsql, [prn, userId, division, dept_id, year], (err, studentResult) => {
        if (err) {
          console.error("Error inserting into student:", err.message);
          return res.status(500).json({ error: `Error inserting into student table => ${err.message}` });
        }

        return res.status(201).json({ message: "Student created successfully!" });
      });
    });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: `Server error => ${err.message}` });
  }
};


const addTeacher = async (req, res) => {
  try {
    const { name, prn, email, password, dept_id, course_id } = req.body;
    const role = 'teacher';

    if (!name || !prn || !email || !password || !dept_id || !course_id) {
      return res.status(400).json({
        error: 'name, prn, email, password, dept_id, course_id are required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, role], (err, userResult) => {
      if (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: `Error inserting into users table => ${err.message}` });
      }

      const userId = userResult.insertId;

      const insertTeacherSql = 'INSERT INTO teacher (prn, dept_id, course_id, user_id) VALUES (?, ?, ?, ?)';
      db.query(insertTeacherSql, [prn, dept_id, course_id, userId], (err, teacherResult) => {
        if (err) {
          console.error("Error inserting into teacher:", err.message);
          return res.status(500).json({ error: `Error inserting into teacher table => ${err.message}` });
        }

        return res.status(201).json({ message: 'Teacher created successfully!' });
      });
    });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: `Server error => ${err.message}` });
  }
};

module.exports = { addDepartment,addStudent,addTeacher };