// Updated: adminController.js with Add & Fetch API

const db = require('../db');
const bcrypt = require('bcrypt');

// === ADD CONTROLLERS ===
const addDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Department name required' });

  try {
    const [result] = await db.query('INSERT INTO department (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Department added successfully', deptId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Department already exists' });
    }
    res.status(500).json({ error: `Database error >> ${err.message}` });
  }
};

const addStudent = async (req, res) => {
  try {
    const { name, email, password, prn,phoneno, dept_id, division, year } = req.body;
    
    const role = 'student';

    if (!name || !email || !password || !prn || !dept_id || !division || !year) {
      return res.status(400).json({
        error: 'name, email, password, prn, dept_id, division, year are required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await db.query('INSERT INTO users (name, email, role,phoneno,password) VALUES (?, ?, ?,?, ?)', [name, email, role,phoneno, hashedPassword]);

    const userId = userResult.insertId;
    await db.query('INSERT INTO student (prn, user_id, division, dept_id, year) VALUES (?, ?, ?, ?, ?)', [prn, userId, division, dept_id, year]);

    res.status(201).json({ message: 'Student created successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or PRN already exists' });
    }
    res.status(500).json({ error: `Server error => ${err.message}` });
  }
};

const addTeacher = async (req, res) => {
  try {
    const { name, prn, email, password, dept_id,phoneno, course_id } = req.body;
    const role = 'teacher';

    // course_id is optional now
    if (!name || !prn || !email || !password || !dept_id ||!phoneno) {
      return res.status(400).json({
        error: 'name, prn, email, password,phoneno, dept_id are required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await db.query(
      'INSERT INTO users (name, email, password,phoneno, role) VALUES (?, ?, ?, ?,?)',
      [name, email, hashedPassword,phoneno, role]
    );

    const userId = userResult.insertId;

    await db.query(
      'INSERT INTO teacher (prn, dept_id, course_id, user_id) VALUES (?, ?, ?, ?)',
      [prn, dept_id, course_id || null, userId] // store NULL if course_id is not provided
    );

    res.status(201).json({ message: 'Teacher created successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or PRN already exists' });
    }
    res.status(500).json({ error: `Server error => ${err.message}` });
  }
};

const updateStudent = async (req, res) => {
  const { id, name, email, prn, dept_id, year, password,phoneno, division } = req.body;
  const role="student";
  console.log(id,name, email, password, prn,phoneno, dept_id, division, year);
  try {
    if (!id || !name || !email || !prn || !dept_id || !year || !phoneno || !division) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Update users table
    await db.query(
      'UPDATE users SET name = ?, email = ?, phoneno = ? WHERE id = ?',
      [name, email, phoneno, id]
    );

    // Update student table
    await db.query(
      'UPDATE student SET prn = ?, dept_id = ?, year = ?, division = ? WHERE user_id = ?',
      [prn, dept_id, year, division, id]
    );

    res.status(200).json({ message: 'Student updated successfully!' });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

const updateTeacher = async (req, res) => {
  const { id, name, email, prn, dept_id, course_id,password,phoneno } = req.body;
  const role="teacher";
  console.log(id,name, email, password, prn,phoneno,course_id, dept_id);
  try {
    if (!id || !name || !email || !prn || !dept_id  || !phoneno || !course_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Update users table
    await db.query(
      'UPDATE users SET name = ?, email = ?, phoneno = ? WHERE id = ?',
      [name, email, phoneno, id]
    );

    // Update student table
    await db.query(
      'UPDATE teacher SET prn = ?, dept_id = ?,course_id=? WHERE user_id = ?',
      [prn, dept_id, course_id,id]
    );

    res.status(200).json({ message: 'Teacher updated successfully!' });
  } catch (err) {
    console.error('Update teacher error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};


// === FETCH CONTROLLERS ===
const getDepartments = async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name FROM department');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

const getStudents = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT u.id, u.name, u.email,u.phoneno, s.prn, s.division, s.year, d.name AS department
      FROM users u
      JOIN student s ON u.id = s.user_id
      LEFT JOIN department d ON s.dept_id = d.id
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

const getTeachers = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT u.id,u.name, u.email,u.phoneno ,t.prn,t.course_id, d.name AS department 
      FROM users u
      JOIN teacher t ON u.id = t.user_id
      LEFT JOIN department d ON t.dept_id = d.id
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch teachers ${err}`});
  }
};

module.exports = {
  addDepartment,
  addStudent,
  addTeacher,
  updateStudent,
  updateTeacher,
  getDepartments,
  getStudents,
  getTeachers
};