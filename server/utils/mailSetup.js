const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email with OTP for password reset
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message content
 */
const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailOptions = {
      from: `"CampusSink Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">CampusSink Password Reset</h2>
          <p>${message}</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #2c3e50;">
            ${message.match(/\d{6}/)?.[0] || 'Your OTP Code'}
          </p>
          <p style="font-size: 12px; color: #7f8c8d;">
            This OTP will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send test email (for testing SMTP configuration)
 */
const sendTestEmail = async () => {
  try {
    await sendEmail({
      email: 'nikitaghyar538@gmail.com',
      subject: 'Test Email',
      message: 'This is a test email from CampusSink',
    });
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Test email failed:', error);
  }
};

module.exports = {
  sendEmail,
  sendTestEmail,
};