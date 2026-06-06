"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays, Stethoscope, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplayValue(0);
      return;
    }

    let frame = 0;
    const duration = 850;
    const startedAt = performance.now();
    const startValue = 1;

    function tick(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (value - startValue) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    setDisplayValue(startValue);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue}</>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, notifications: 0 });
  const user = useSessionUser();
  const role = user?.role || "patient";

  useEffect(() => {
    async function load() {
      const [doctors, patients, appointments, notifications] = await Promise.all([
        api<any[]>("/doctors"),
        role === "patient" ? Promise.resolve({ ok: true, data: [] }) : api<any[]>("/patients"),
        api<any[]>("/appointments"),
        api<any[]>("/notifications")
      ]);

      setStats({
        doctors: doctors.data?.length || 0,
        patients: patients.data?.length || 0,
        appointments: appointments.data?.length || 0,
        notifications: notifications.data?.length || 0
      });
    }

    load();
  }, [role]);

  return (
    <AppShell>
      <section className="page-section">
        <div className="section-heading">
          <h1>Dashboard</h1>
          <p>Operational overview for appointment and treatment activity.</p>
        </div>
        <div className="stats-grid">
          <div className="data-card stat-doctors">
            <Stethoscope className="stat-icon" size={22} />
            <span>Doctors</span>
            <strong><AnimatedNumber value={stats.doctors} /></strong>
            <small>Available specialists</small>
          </div>
          <div className="data-card stat-patients">
            <Users className="stat-icon" size={22} />
            <span>Patients</span>
            <strong><AnimatedNumber value={stats.patients} /></strong>
            <small>Registered records</small>
          </div>
          <div className="data-card stat-appointments">
            <CalendarDays className="stat-icon" size={22} />
            <span>Appointments</span>
            <strong><AnimatedNumber value={stats.appointments} /></strong>
            <small>Booked and tracked</small>
          </div>
          <div className="data-card stat-alerts">
            <Bell className="stat-icon" size={22} />
            <span>Alerts</span>
            <strong><AnimatedNumber value={stats.notifications} /></strong>
            <small>Patient reminders</small>
          </div>
        </div>
        <div className="insight-grid">
          <div className="insight-card">
            <span>Today&apos;s focus</span>
            <strong>{stats.appointments > 0 ? "Review active appointments" : "Ready for new bookings"}</strong>
          </div>
          <div className="insight-card">
            <span>Care continuity</span>
            <strong>{role === "patient" ? "Track prescriptions and follow-ups" : "Keep treatment records current"}</strong>
          </div>
          <div className="insight-card">
            <span>Engagement</span>
            <strong>{stats.notifications} reminder{stats.notifications === 1 ? "" : "s"} available</strong>
          </div>
        </div>
        <div className="workflow-band">
          <div>
            <span>Current lifecycle</span>
            <strong>Request - Approval - Doctor assignment - Treatment - Prescription - Follow-up</strong>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
