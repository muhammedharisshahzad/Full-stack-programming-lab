const express = require("express");
const Prescription = require("../models/Prescription");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { protect, allowRoles } = require("../middleware/auth");
const { createNotification } = require("../utils/notify");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const filter = {};

  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    filter.patient = patient?._id;
  }

  if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user._id });
    filter.doctor = doctor?._id;
  }

  const prescriptions = await Prescription.find(filter)
    .populate("patient")
    .populate("doctor")
    .populate("appointment")
    .sort({ issuedAt: -1 });
  res.json(prescriptions);
});

router.post("/", protect, allowRoles("doctor"), async (req, res) => {
  const prescription = await Prescription.create(req.body);

  for (const medication of prescription.medications || []) {
    await createNotification({
      patient: prescription.patient,
      type: "medication",
      channel: "in-app",
      title: `Medication reminder: ${medication.name}`,
      message: `Take ${medication.dosage} ${medication.frequency}. ${medication.instructions || ""}`.trim()
    });
  }

  res.status(201).json(prescription);
});

module.exports = router;
