"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const role = useSessionUser()?.role;

  async function load() {
    const [prescriptionResult, appointmentResult] = await Promise.all([
      api<any[]>("/prescriptions"),
      api<any[]>("/appointments")
    ]);
    if (prescriptionResult.ok) setPrescriptions(prescriptionResult.data || []);
    if (appointmentResult.ok) setAppointments(appointmentResult.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addPrescription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const appointment = appointments.find((item) => item._id === form.get("appointment"));
    const result = await api("/prescriptions", {
      method: "POST",
      body: JSON.stringify({
        appointment: form.get("appointment"),
        patient: appointment?.patient?._id,
        doctor: appointment?.doctor?._id,
        medications: [
          {
            name: form.get("medicine"),
            dosage: form.get("dosage"),
            frequency: form.get("frequency"),
            duration: form.get("duration"),
            reminderTimes: [String(form.get("time") || "09:00")]
          }
        ],
        notes: form.get("notes")
      })
    });
    setToast(result.ok ? "Prescription added with medication reminder" : result.message || "Could not add prescription");
    if (result.ok) {
      formElement.reset();
      load();
    }
  }

  return (
    <AppShell>
      <section className="page-section">
        <Toast message={toast} />
        <div className="section-heading">
          <h1>Prescriptions</h1>
          <p>Maintain medicine details, dosage schedules, and appointment-linked records.</p>
        </div>
        {role === "doctor" && (
          <form className="inline-form" onSubmit={addPrescription}>
            <select name="appointment" required>
              <option value="">Appointment</option>
              {appointments
                .filter((item) => item.status === "approved" && item.doctor)
                .map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.patient?.name} - {new Date(item.appointmentDate).toLocaleDateString()}
                  </option>
                ))}
            </select>
            <input name="medicine" placeholder="Medicine" required />
            <input name="dosage" placeholder="Dosage" required />
            <input name="frequency" placeholder="Frequency" required />
            <input name="duration" placeholder="Duration" required />
            <input name="time" type="time" />
            <input name="notes" placeholder="Notes" />
            <button className="primary-button">Add</button>
          </form>
        )}
        <DataTable
          columns={["Patient", "Doctor", "Medication", "Schedule", "Issued"]}
          rows={prescriptions.map((prescription) => [
            prescription.patient?.name || "-",
            prescription.doctor?.name || "-",
            prescription.medications?.map((item: any) => item.name).join(", ") || "-",
            prescription.medications?.map((item: any) => `${item.dosage}, ${item.frequency}`).join("; ") || "-",
            new Date(prescription.issuedAt).toLocaleDateString()
          ])}
        />
      </section>
    </AppShell>
  );
}
