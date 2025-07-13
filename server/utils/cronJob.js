const cron = require('node-cron');
const db = require('../db'); // Your DB connection
const {sendEmail}= require('./mailSetup');

// Runs every hour
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Running notification job...');

  //24 * 60 * 60 * 1000
  const now = new Date();
  const next24hrs = new Date(Date.now() + 1000*60);

  try {
    const [assignments] = await db.execute(
      `SELECT a.*, u.email, u.name FROM assignments a 
       JOIN student s ON a.year = s.year AND a.branch = (SELECT name FROM department WHERE id = s.dept_id)
       JOIN users u ON s.user_id = u.id
       WHERE a.deadline BETWEEN ? AND ?`,
      [now, next24hrs]
    );

    assignments.forEach(async (ass) => {
      const message = `
        Hello ${ass.name},\n
        Reminder: You have an upcoming assignment "${ass.title}" due on ${new Date(ass.deadline).toLocaleString()}.
      `;

      // ✅ Example: Send Email
      await sendEmail(ass.email, '📢 Assignment Deadline Reminder', message);

      // ✅ Optional: Store in your `notifications` table for in-app bell icon
      await db.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [ass.user_id, 'Assignment Deadline Reminder', message, 'assignment']
      );
    });

  } catch (err) {
    console.error('❌ Cron error:', err);
  }
});
