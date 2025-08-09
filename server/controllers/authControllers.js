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
        phoneno,
        division // Optional for students
        } = req.body;

        console.log("phone no aa rha >> ",phoneno,role,email,name);

        // 1. Basic validation
        if (!name || !email || !password || !role || !phoneno) {
        return res.status(400).json({ error: 'Missing required fields' });
        }


        try {
            // 2. Hash the password
            const hashedPwd = await bcrypt.hash(password, 10);
            console.log("Phone no>>",phoneno);
            // 3. Insert into users table
            const userSql = 'INSERT INTO users (name, email, password,phoneno, role) VALUES (?, ?, ?, ?,?)';
            db.query(userSql, [name, email, hashedPwd,phoneno, role], (err, result) => {

            if (err) return res.status(500).json({ error: 'Email might already be in use or DB error' });

            const userId = result.insertId;

            // 4. Role-specific insert
            if (role === 'student') {
                const studentSql = 'INSERT INTO student (user_id, prn, year, dept_id, division) VALUES (?, ?, ?, ?, ?)';

                db.query(studentSql, [userId, prn, year, dept_id, division], (err2) => {
                if (err2) return res.status(500).json({ error: `Error inserting student details --> ${err2.message}` });
                res.status(201).json({ message: 'Student added successfully',phoneno:phoneno });
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


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📩 [START] forgotPassword API hit");
    console.log("🆔 Email from request:", email);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("❌ Email validation failed");
      return res.status(400).json({ error: "Please provide a valid email address" });
    }
    console.log("✅ Email validation passed");

    // 1. Check if user exists
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log(`🔍 Found ${results.length} matching user(s)`);

    if (results.length === 0) {
      console.log("⚠️ No user found, sending safe success response");
      return res.status(200).json({
        message: "If this email exists in our system, you'll receive an OTP"
      });
    }

    // 2. Generate and store OTP
    const otp = generateOTP();
    otpCache.set(email, otp);
    console.log(`🔑 Generated OTP: ${otp}`);

    // 3. Send OTP via email (callback style)
    const message = `Your OTP for password reset is: ${otp}`;
    console.log("✉️ Sending email...");

    sendEmail({ email, subject: 'Password Reset OTP', message }, (emailErr) => {
      if (emailErr) {
        console.error("❌ Email sending error:", emailErr);
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
      console.log("✅ Email sent successfully");
     
     
    });
     res.status(200).json({
        message: "If this email exists in our system, you'll receive an OTP"
      });
      console.log("🏁 [END] forgotPassword API completed successfully");
  } catch (error) {
    console.error("💥 Error in forgotPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log("📩 [START] resetPassword API hit");
    console.log("🆔 Email:", email, "| OTP:", otp, "| New password length:", newPassword?.length);

    // 1️⃣ Validate input
    if (!email || !otp || !newPassword) {
      console.warn("❌ Missing required fields");
      return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 8) {
      console.warn("❌ Password too short");
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // 2️⃣ Verify OTP
    const storedOtp = otpCache.get(email);
    if (!storedOtp || storedOtp !== otp) {
      console.warn("❌ Invalid or expired OTP for", email);
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    console.log("✅ OTP verification passed");

    // 3️⃣ Hash new password
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
    console.log("🔐 Password hashed successfully");

    // 4️⃣ Update password in database
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      console.warn("⚠️ No user found with email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    // 5️⃣ Clear OTP from cache
    otpCache.del(email);
    console.log("🗑️ OTP cleared from cache for", email);

    // 6️⃣ Success response
    console.log("✅ Password reset successful for", email);
    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("💥 Error in resetPassword:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



const getStudentInfo = async (req, res) => {
  const { email } = req.body;

  try {
    const [result] = await db.execute(`
      SELECT 
        student.prn, 
        student.year, 
        student.division, 
        student.dept_id, 
        users.id as user_id, 
        users.name, 
        users.email,
        department.name AS department
      FROM student
      INNER JOIN users ON student.user_id = users.id
      LEFT JOIN department ON student.dept_id = department.id
      WHERE users.email = ?
    `, [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error while fetching student info:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};


const getUserWithEmail=async (req,res)=>{
  const {email}=req.body;
  try{
    const sql=`select * from users where email=?`
    const results=await db.query(sql,[email]);

    res.status(201).json({
      data:results[0]
    })
  }
  catch(err){
   res.status(500).json({
    message:err.message
   })
  }
}

module.exports = { addUser ,login,forgotPassword,verifyOtp,resetPassword,getStudentInfo,getUserWithEmail};




