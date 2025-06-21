const db = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const otpCache = new NodeCache({ stdTTL: 300 }); // OTP expires in 5 minutes
const {sendEmail,sendTestEmail}=require('../utils/mailSetup');



const addUser = async (req, res) => {
        const {
        name,
        email,
        password,
        role, // 'student' | 'teacher' | 'admin'
        prn,
        year,
        dept_id,
        division // Optional for students
        } = req.body;

        // 1. Basic validation
        if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
        }


        try {
            // 2. Hash the password
            const hashedPwd = await bcrypt.hash(password, 10);

            // 3. Insert into users table
            const userSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(userSql, [name, email, hashedPwd, role], (err, result) => {

            if (err) return res.status(500).json({ error: 'Email might already be in use or DB error' });

            const userId = result.insertId;

            // 4. Role-specific insert
            if (role === 'student') {
                const studentSql = 'INSERT INTO student (user_id, prn, year, dept_id, division) VALUES (?, ?, ?, ?, ?)';

                db.query(studentSql, [userId, prn, year, dept_id, division], (err2) => {
                if (err2) return res.status(500).json({ error: `Error inserting student details --> ${err2.message}` });
                res.status(201).json({ message: 'Student added successfully' });
                });
            } 
            else if (role === 'teacher') {
                const teacherSql = 'INSERT INTO teacher (user_id, prn, dept_id) VALUES (?, ?, ?)';

                db.query(teacherSql, [userId, prn, dept_id], (err2) => {
                if (err2) return res.status(500).json({ error: `Error inserting teacher details --> ${err2.message}` });
                res.status(201).json({ message: 'Teacher added successfully' });
                });
            } 
            else if (role === 'admin') {
                // const adminSql = 'INSERT INTO admin (user_id) VALUES (?)';
                res.status(201).json({ message: 'Admin added successfully' });
            } 
            else {
                res.status(400).json({ error: 'Invalid role' });
            }
            });
    } 
    catch (error) {
      res.status(500).json({ error: 'Server error', detail: error.message });
    }

   };

const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // 2. Fetch user using promise-based query
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    // 3. Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        algorithm: 'HS256'
      }
    );

    // 5. Remove sensitive data
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // 6. Set HTTP-only cookie (optional)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    // 7. Respond
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Generate random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const forgotPassword = (req, res) => {
  const { email } = req.body;

  // Validate email input
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  // 1. Check if user exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Don't reveal whether email exists (security best practice)
    if (results.length === 0) {
      // Still return success to prevent email enumeration
      return res.status(200).json({
        message: "If this email exists in our system, you'll receive an OTP"
      });
    }

    // 2. Generate and store OTP
    const otp = generateOTP();
    otpCache.set(email, otp); // Set with TTL (time-to-live)
    
    console.log(`OTP for ${email}: ${otp}`); // For development/testing

    // 3. Send OTP via email
    const message = `Your OTP for password reset is: ${otp}`;
    
    sendEmail({
      email: email,
      subject: 'Password Reset OTP',
      message
    }, 
    (emailErr) => {
      if (emailErr) {
        console.error('Email sending error:', emailErr);
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    });

    res.status(200).json({
        message: "If this email exists in our system, you'll receive an OTP"
    });
  });
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = otpCache.get(email);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({
      message: "OTP verified successfully"
    });
  } catch (error) {
    res.status(500).json(`Hii verify otp se:==> { message: error.message }`);
  }
};


const resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;


  console.log("email: ",email,"  otp: ",otp," newpass: ",newPassword);
  // Input validation
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "Email, OTP, and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  // Verify OTP
  const storedOtp = otpCache.get(email);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // Hash new password
  bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error('Password hashing error:', hashErr);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Update password in database
    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (dbErr, result) => {
      if (dbErr) {
        console.error('Database error:', dbErr);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Clear OTP from cache
      otpCache.del(email);
       
      res.status(200).json({
        message: "Password reset successfully"
      });
    });
  });
};

module.exports = { addUser ,login,forgotPassword,verifyOtp,resetPassword};




