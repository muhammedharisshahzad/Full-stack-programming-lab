const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    bloodGroup: { type: String, trim: true },
    address: { type: String, trim: true },
    allergies: [{ type: String, trim: true }],
    medicalHistory: [{ condition: String, diagnosedAt: Date, notes: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
