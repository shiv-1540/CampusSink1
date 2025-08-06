// Basic Express App Setup
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Importing the Routes 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assiRoutes = require('./routes/assiRoutes');
const semiRoutes = require('./routes/semiRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const academicCalendarRoutes = require("./routes/academicCalendar");

// For Cron Job
const cron = require('node-cron');
const db = require('./db'); // DB connection
const { sendEmail1 } = require('./utils/mailSetup');

const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const app = express();
const PORT = 5000;

// CORS ORIGIN 
const allowedOrigins = [
  'http://localhost:5173',
  'https://campus-sink.vercel.app',
  'https://zjlgkdzc-5173.inc1.devtunnels.ms/'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.length !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/academic-calendar", academicCalendarRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assiRoutes);
app.use("/api/seminars", semiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", aiRoutes);

// ✅ Root route to show success message
app.get("/", (req, res) => {
  res.send("✅ CampusSink API is running successfully.");
});

// ✅ Cron Job Setup (every 100 minutes)
console.log("🟢 Cron script loaded");

cron.schedule('*/100 * * * *', async () => {
  console.log('⏰ Cron started - checking for upcoming assignments');

  const now = new Date();
  const next24hrs = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hrs ahead

  console.log("🔍 Time window:");
  console.log("    ➤ Now:        ", now.toLocaleString());
  console.log("    ➤ Next 24hrs: ", next24hrs.toLocaleString());

  try {
    const [assignments] = await db.execute(
      `SELECT a.*, u.email, u.name, u.phoneno, u.id as user_id 
       FROM assignments a 
       JOIN student s ON a.year = s.year AND a.branch = (SELECT name FROM department WHERE id = s.dept_id)
       JOIN users u ON s.user_id = u.id
       WHERE a.deadline BETWEEN ? AND ?`,
      [now, next24hrs]
    );

    console.log(`📦 Found ${assignments.length} assignment(s) due within next 24 hours`);

    for (const ass of assignments) {
      const message = `
        Hello ${ass.name},

        ⏰ Reminder: You have an assignment titled **"${ass.title}"** due on 
        ${new Date(ass.deadline).toLocaleString()}.

        Please make sure to submit it on time.
        - CampusSink Platform`;

      try {
        const res = await sendEmail1(ass.email, '📢 Assignment Deadline Reminder', message);
        console.log(`📧 Email sent to ${ass.email}: ${res.accepted?.[0] || 'Sent'}`);
      } catch (emailErr) {
        console.error(`❌ Failed to send email to ${ass.email}:`, emailErr.message);
      }

      try {
        const whatsappMessage = await client.messages.create({
          to: `whatsapp:+91${ass.phoneno}`,
          from: 'whatsapp:+14155238886',
          body: message,
        });
        console.log(`📱 WhatsApp sent to ${ass.name} (${ass.phoneno}): ${whatsappMessage.sid}`);
      } catch (waErr) {
        console.error(`❌ WhatsApp failed for ${ass.name}:`, waErr.message);
      }

      try {
        await db.execute(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [ass.user_id, 'Assignment Deadline Reminder', message, 'assignment']
        );
        console.log(`🔔 Notification saved for ${ass.name} (User ID: ${ass.user_id})`);
      } catch (notifErr) {
        console.error('❌ Error saving notification in DB:', notifErr.message);
      }
    }

    console.log('✅ Cron job completed.\n');
  } catch (err) {
    console.error('❌ Cron error while querying DB:', err.message);
  }
});

console.log("🟢 Cron job initialized successfully");

// 🔹 Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log("🚀 CampusSink API is running successfully!");
});
