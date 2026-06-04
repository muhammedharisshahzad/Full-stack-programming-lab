const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    type: {
      type: String,
      enum: ["appointment", "medication", "follow-up", "system"],
      default: "system"
    },
    channel: { type: String, enum: ["email", "mobile", "in-app"], default: "in-app" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    scheduledFor: Date,
    sentAt: Date,
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
