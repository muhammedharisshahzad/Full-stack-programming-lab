require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const connectDB = require("./config/db");
const Notification = require("./models/Notification");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "HealthLink API" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/treatments", require("./routes/treatmentRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || "Server error" });
});

cron.schedule("*/15 * * * *", async () => {
  await Notification.updateMany(
    { scheduledFor: { $lte: new Date() }, status: "pending" },
    { status: "sent", sentAt: new Date() }
  );
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(port, () => console.log(`API running on port ${port}`)))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
