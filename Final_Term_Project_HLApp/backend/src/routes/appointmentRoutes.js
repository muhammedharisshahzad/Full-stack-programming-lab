const express = require("express");
const { body } = require("express-validator");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Treatment = require("../models/Treatment");
const { protect, allowRoles } = require("../middleware/auth");
const validate = require("../middleware/validate");
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

  const appointments = await Appointment.find(filter)
    .populate("patient")
    .populate("doctor")
    .sort({ appointmentDate: 1 });
  res.json(appointments);
});

router.post(
  "/",
  protect,
  allowRoles("patient", "admin"),
  [
    body("appointmentDate").isISO8601().withMessage("Appointment date is required"),
    body("reason").trim().notEmpty().withMessage("Reason is required")
  ],
  validate,
  async (req, res) => {
    let patientId = req.body.patient;

    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      patientId = patient?._id;
    }

    if (!patientId) return res.status(400).json({ message: "Patient profile is required" });

    const appointment = await Appointment.create({ ...req.body, patient: patientId });
    res.status(201).json(appointment);
  }
);

router.patch("/:id/status", protect, allowRoles("admin", "doctor"), async (req, res) => {
  const { status, doctor, adminNote } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate("patient");
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });

  appointment.status = status || appointment.status;
  appointment.doctor = doctor || appointment.doctor;
  appointment.adminNote = adminNote || appointment.adminNote;
  await appointment.save();

  if (appointment.status === "approved" && appointment.doctor) {
    await Treatment.findOneAndUpdate(
      { appointment: appointment._id },
      { appointment: appointment._id, patient: appointment.patient._id, doctor: appointment.doctor, status: "active" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await createNotification({
      patient: appointment.patient._id,
      recipient: appointment.patient.user,
      type: "appointment",
      channel: "in-app",
      title: "Appointment confirmed",
      message: `Your appointment for ${appointment.appointmentDate.toDateString()} has been confirmed.`
    });
  }

  res.json(await appointment.populate("doctor"));
});

module.exports = router;
