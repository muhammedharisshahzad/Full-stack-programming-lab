const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    requestedSpecialization: { type: String, trim: true },
    appointmentDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending"
    },
    adminNote: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
