import nodemailer from "nodemailer";

/**
 * Utility to send email messages via SMTP (e.g. NodeMailer).
 * @param {Object} options - Email parameters.
 * @param {string} options.email - Recipient email.
 * @param {string} options.subject - Email subject header.
 * @param {string} options.message - Plain text fallback body.
 * @param {string} [options.html] - HTML body content.
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"KALAKOSH Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
