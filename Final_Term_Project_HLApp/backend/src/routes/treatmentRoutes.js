const express = require("express");
const Treatment = require("../models/Treatment");
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

  const treatments = await Treatment.find(filter)
    .populate("patient")
    .populate("doctor")
    .populate("appointment")
    .sort({ updatedAt: -1 });
  res.json(treatments);
});

router.patch("/:id", protect, allowRoles("doctor", "admin"), async (req, res) => {
  const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("patient doctor appointment");

  if (!treatment) return res.status(404).json({ message: "Treatment not found" });
  res.json(treatment);
});

router.post("/:id/checkups", protect, allowRoles("doctor"), async (req, res) => {
  const treatment = await Treatment.findById(req.params.id);
  if (!treatment) return res.status(404).json({ message: "Treatment not found" });

  treatment.physicalCheckups.push(req.body);
  if (req.body.doctorNotes) treatment.progressNotes.push({ note: req.body.doctorNotes });
  await treatment.save();
  res.status(201).json(treatment);
});

router.post("/:id/followups", protect, allowRoles("doctor", "admin"), async (req, res) => {
  const treatment = await Treatment.findById(req.params.id).populate("patient");
  if (!treatment) return res.status(404).json({ message: "Treatment not found" });

  treatment.followUps.push(req.body);
  await treatment.save();

  await createNotification({
    patient: treatment.patient._id,
    recipient: treatment.patient.user,
    type: "follow-up",
    channel: "in-app",
    title: "Follow-up scheduled",
    message: `Your follow-up visit is scheduled for ${new Date(req.body.visitDate).toDateString()}.`,
    scheduledFor: req.body.visitDate
  });

  res.status(201).json(treatment);
});

module.exports = router;
