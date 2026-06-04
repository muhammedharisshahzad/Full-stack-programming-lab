"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays, Stethoscope, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

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
            <strong>{stats.doctors}</strong>
            <small>Available specialists</small>
          </div>
          <div className="data-card stat-patients">
            <Users className="stat-icon" size={22} />
            <span>Patients</span>
            <strong>{stats.patients}</strong>
            <small>Registered records</small>
          </div>
          <div className="data-card stat-appointments">
            <CalendarDays className="stat-icon" size={22} />
            <span>Appointments</span>
            <strong>{stats.appointments}</strong>
            <small>Booked and tracked</small>
          </div>
          <div className="data-card stat-alerts">
            <Bell className="stat-icon" size={22} />
            <span>Alerts</span>
            <strong>{stats.notifications}</strong>
            <small>Patient reminders</small>
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
