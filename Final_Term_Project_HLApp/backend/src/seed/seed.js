require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Treatment = require("../models/Treatment");
const Prescription = require("../models/Prescription");
const Notification = require("../models/Notification");

const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "ENT",
  "Psychiatry",
  "Gynecology",
  "Ophthalmology",
  "General Medicine",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Urology",
  "Dental Surgery"
];

const patientNames = [
  "Ayesha Khan",
  "Bilal Ahmed",
  "Hira Malik",
  "Usman Tariq",
  "Sana Farooq",
  "Hamza Ali",
  "Maham Raza",
  "Danish Sheikh",
  "Iqra Noor",
  "Zain Abbas",
  "Nimra Saeed",
  "Fahad Javed",
  "Laiba Hassan",
  "Omar Siddiqui",
  "Mehwish Iqbal"
];

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
    Appointment.deleteMany({}),
    Treatment.deleteMany({}),
    Prescription.deleteMany({}),
    Notification.deleteMany({})
  ]);

  await User.create({
    name: "System Administrator",
    email: "admin@healthlink.test",
    password: "Admin@123",
    role: "admin",
    phone: "+92-300-0000000"
  });

  const doctors = [];
  for (let index = 0; index < 15; index += 1) {
    const user = await User.create({
      name: `Dr. ${["Sarah", "Ahmed", "Mariam", "Hassan", "Nadia", "Ali", "Zoya", "Rehan", "Noor", "Saad", "Amna", "Kamran", "Rabia", "Imran", "Fatima"][index]} ${["Khan", "Malik", "Raza", "Sheikh", "Iqbal"][index % 5]}`,
      email: `doctor${index + 1}@healthlink.test`,
      password: "Doctor@123",
      role: "doctor",
      phone: `+92-311-10000${String(index + 1).padStart(2, "0")}`
    });

    doctors.push(
      await Doctor.create({
        user: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        specialization: specializations[index],
        qualification: index % 2 === 0 ? "MBBS, FCPS" : "MBBS, MD",
        experienceYears: 4 + index,
        consultationFee: 1800 + index * 150,
        availability: [
          { day: "Monday", start: "09:00", end: "13:00" },
          { day: "Wednesday", start: "14:00", end: "18:00" }
        ]
      })
    );
  }

  for (let index = 0; index < 15; index += 1) {
    const user = await User.create({
      name: patientNames[index],
      email: `patient${index + 1}@healthlink.test`,
      password: "Patient@123",
      role: "patient",
      phone: `+92-321-20000${String(index + 1).padStart(2, "0")}`
    });

    await Patient.create({
      user: user._id,
      assignedDoctor: doctors[index % doctors.length]._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: 20 + index * 2,
      gender: index % 3 === 0 ? "female" : index % 3 === 1 ? "male" : "other",
      bloodGroup: ["A+", "B+", "O+", "AB+", "A-"][index % 5],
      address: `House ${index + 12}, Health Avenue, Lahore`,
      allergies: index % 2 === 0 ? ["Dust"] : [],
      medicalHistory: [{ condition: "Routine checkup", diagnosedAt: new Date(), notes: "Seed record" }]
    });
  }

  console.log("Seed completed with 15 doctors and 15 patients.");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
