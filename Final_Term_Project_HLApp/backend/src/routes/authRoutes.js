const express = require("express");
const { body } = require("express-validator");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const signToken = require("../utils/token");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").isIn(["admin", "doctor", "patient"]).withMessage("Role must be admin, doctor, or patient"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("age").if(body("role").equals("patient")).isInt({ min: 0 }).withMessage("Patient age is required"),
    body("gender")
      .if(body("role").equals("patient"))
      .isIn(["male", "female", "other"])
      .withMessage("Patient gender is required"),
    body("specialization")
      .if(body("role").equals("doctor"))
      .trim()
      .notEmpty()
      .withMessage("Doctor specialization is required"),
    body("qualification")
      .if(body("role").equals("doctor"))
      .trim()
      .notEmpty()
      .withMessage("Doctor qualification is required")
  ],
  validate,
  async (req, res) => {
    const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role, phone });

    if (role === "doctor") {
      await Doctor.create({
        user: user._id,
        name,
        email,
        phone,
        specialization: req.body.specialization,
        qualification: req.body.qualification
      });
    }

    if (role === "patient") {
      await Patient.create({
        user: user._id,
        name,
        email,
        phone,
        age: req.body.age,
        gender: req.body.gender
      });
    }

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: signToken(user)
    });
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validate,
  async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: signToken(user)
    });
  }
);

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", protect, (req, res) => {
  res.json({ message: "Logged out successfully. Remove token on client." });
});

module.exports = router;
