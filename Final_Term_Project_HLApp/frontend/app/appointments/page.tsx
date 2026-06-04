"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const role = useSessionUser()?.role;

  async function load() {
    const [appointmentResult, doctorResult] = await Promise.all([api<any[]>("/appointments"), api<any[]>("/doctors")]);
    if (appointmentResult.ok) setAppointments(appointmentResult.data || []);
    if (doctorResult.ok) setDoctors(doctorResult.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const result = await api("/appointments", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form))
    });
    setToast(result.ok ? "Appointment request submitted" : result.message || "Booking failed");
    if (result.ok) {
      formElement.reset();
      load();
    }
  }

  async function setStatus(id: string, status: string, doctor?: string) {
    const result = await api(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, doctor })
    });
    setToast(result.ok ? `Appointment ${status}` : result.message || "Update failed");
    if (result.ok) load();
  }

  return (
    <AppShell>
      <section className="page-section">
        <Toast message={toast} />
        <div className="section-heading">
          <h1>Appointments</h1>
          <p>Book, approve, assign doctors, and start treatment cycles.</p>
        </div>
        {role === "patient" && (
          <form className="inline-form" onSubmit={book}>
            <input name="appointmentDate" type="datetime-local" required />
            <input name="requestedSpecialization" placeholder="Specialization" />
            <input name="reason" placeholder="Reason for visit" required />
            <button className="primary-button">Book</button>
          </form>
        )}
        <DataTable
          columns={["Patient", "Doctor", "Date", "Reason", "Status", "Action"]}
          rows={appointments.map((appointment) => [
            appointment.patient?.name || "-",
            appointment.doctor?.name || "Not assigned",
            new Date(appointment.appointmentDate).toLocaleString(),
            appointment.reason,
            <span className={`status ${appointment.status}`}>{appointment.status}</span>,
            role === "admin" || role === "doctor" ? (
              <span className="row-actions">
                <select
                  aria-label="Doctor"
                  defaultValue={appointment.doctor?._id || ""}
                  onChange={(event) => setStatus(appointment._id, "approved", event.target.value)}
                >
                  <option value="">Assign</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                <button className="secondary-button small" onClick={() => setStatus(appointment._id, "rejected")}>
                  Reject
                </button>
              </span>
            ) : (
              "Submitted"
            )
          ])}
        />
      </section>
    </AppShell>
  );
}
