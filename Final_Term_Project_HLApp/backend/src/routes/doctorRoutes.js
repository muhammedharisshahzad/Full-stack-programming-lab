const express = require("express");
const { body } = require("express-validator");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { protect, allowRoles } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json(doctors);
});

router.post(
  "/",
  protect,
  allowRoles("admin"),
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("phone").trim().notEmpty(),
    body("specialization").trim().notEmpty(),
    body("qualification").trim().notEmpty()
  ],
  validate,
  async (req, res) => {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  }
);

router.put("/:id", protect, allowRoles("admin"), async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

router.delete("/:id", protect, allowRoles("admin"), async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json({ message: "Doctor deleted" });
});

router.post("/:doctorId/assign/:patientId", protect, allowRoles("admin"), async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.patientId,
    { assignedDoctor: req.params.doctorId },
    { new: true }
  ).populate("assignedDoctor");

  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});

module.exports = router;
