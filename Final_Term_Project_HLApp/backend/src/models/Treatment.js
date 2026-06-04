const mongoose = require("mongoose");

const checkupSchema = new mongoose.Schema(
  {
    visitDate: { type: Date, default: Date.now },
    bloodPressure: String,
    pulse: String,
    temperature: String,
    weight: String,
    symptoms: String,
    doctorNotes: String
  },
  { _id: false }
);

const followUpSchema = new mongoose.Schema(
  {
    visitDate: Date,
    purpose: String,
    status: { type: String, enum: ["scheduled", "completed", "missed"], default: "scheduled" },
    notes: String
  },
  { _id: false }
);

const treatmentSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    diagnosis: { type: String, trim: true },
    status: { type: String, enum: ["active", "improving", "completed", "paused"], default: "active" },
    progressNotes: [{ note: String, addedAt: { type: Date, default: Date.now } }],
    physicalCheckups: [checkupSchema],
    followUps: [followUpSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
