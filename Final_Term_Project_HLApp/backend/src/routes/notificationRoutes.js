const express = require("express");
const Notification = require("../models/Notification");
const Patient = require("../models/Patient");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const filter = {};

  if (req.user.role !== "admin") {
    const patient = await Patient.findOne({ user: req.user._id });
    filter.$or = [{ recipient: req.user._id }, { patient: patient?._id }];
  }

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(notifications);
});

router.post("/simulate-mobile", protect, async (req, res) => {
  const notification = await Notification.create({
    recipient: req.user._id,
    type: req.body.type || "system",
    channel: "mobile",
    title: req.body.title || "Mobile alert",
    message: req.body.message || "This is a simulated mobile notification.",
    status: "sent",
    sentAt: new Date()
  });

  res.status(201).json(notification);
});

module.exports = router;
