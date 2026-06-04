const nodemailer = require("nodemailer");
const Notification = require("../models/Notification");

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function createNotification(payload) {
  const notification = await Notification.create(payload);
  const transporter = getTransporter();

  if (payload.channel === "email" && transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: payload.email,
        subject: payload.title,
        text: payload.message
      });
      notification.status = "sent";
      notification.sentAt = new Date();
      await notification.save();
    } catch (error) {
      notification.status = "failed";
      await notification.save();
    }
  }

  return notification;
}

module.exports = { createNotification };
