const express = require("express");
const { body } = require("express-validator");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { protect, allowRoles } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", protect, allowRoles("admin", "doctor"), async (req, res) => {
  const query = {};

  if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user._id });
    query.assignedDoctor = doctor?._id;
  }

  const patients = await Patient.find(query).populate("assignedDoctor").sort({ createdAt: -1 });
  res.json(patients);
});

router.get("/mine", protect, allowRoles("patient"), async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id }).populate("assignedDoctor");
  res.json(patient);
});

router.post(
  "/",
  protect,
  allowRoles("admin"),
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("phone").trim().notEmpty(),
    body("age").isInt({ min: 0 }),
    body("gender").isIn(["male", "female", "other"])
  ],
  validate,
  async (req, res) => {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  }
);

router.put("/:id", protect, allowRoles("admin", "doctor"), async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});

router.delete("/:id", protect, allowRoles("admin"), async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json({ message: "Patient deleted" });
});

module.exports = router;
