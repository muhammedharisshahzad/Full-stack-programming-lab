"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const role = useSessionUser()?.role;

  async function load() {
    const [patientResult, doctorResult] = await Promise.all([api<any[]>("/patients"), api<any[]>("/doctors")]);
    if (patientResult.ok) setPatients(patientResult.data || []);
    if (doctorResult.ok) setDoctors(doctorResult.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const result = await api("/patients", {
      method: "POST",
      body: JSON.stringify({ ...Object.fromEntries(form), age: Number(form.get("age")) })
    });
    setToast(result.ok ? "Patient added successfully" : result.message || "Could not add patient");
    if (result.ok) {
      formElement.reset();
      load();
    }
  }

  async function removePatient(id: string) {
    if (!confirm("Delete this patient record?")) return;
    const result = await api(`/patients/${id}`, { method: "DELETE" });
    setToast(result.ok ? "Patient deleted" : result.message || "Delete failed");
    if (result.ok) load();
  }

  async function updatePatient(patient: any) {
    const phone = prompt("Update phone number", patient.phone || "");
    if (phone === null) return;
    const bloodGroup = prompt("Update blood group", patient.bloodGroup || "");
    if (bloodGroup === null) return;

    const result = await api(`/patients/${patient._id}`, {
      method: "PUT",
      body: JSON.stringify({ phone, bloodGroup })
    });
    setToast(result.ok ? "Patient updated successfully" : result.message || "Update failed");
    if (result.ok) load();
  }

  async function assignDoctor(patientId: string, doctorId: string) {
    if (!doctorId) return;
    const result = await api(`/doctors/${doctorId}/assign/${patientId}`, { method: "POST" });
    setToast(result.ok ? "Doctor assigned to patient" : result.message || "Assignment failed");
    if (result.ok) load();
  }

  return (
    <AppShell>
      <section className="page-section">
        <Toast message={toast} />
        <div className="section-heading">
          <h1>Patients</h1>
          <p>Maintain patient records, history, and doctor assignment details.</p>
        </div>
        {role === "admin" && (
          <form className="inline-form" onSubmit={createPatient}>
            <input name="name" placeholder="Patient name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="phone" placeholder="Phone" required />
            <input name="age" type="number" placeholder="Age" required />
            <select name="gender" required>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <button className="primary-button">Add</button>
          </form>
        )}
        <DataTable
          columns={["Name", "Age", "Gender", "Blood", "Assigned Doctor", "Action"]}
          rows={patients.map((patient) => [
            patient.name,
            patient.age,
            patient.gender,
            patient.bloodGroup || "-",
            role === "admin" ? (
              <select
                aria-label="Assign doctor"
                defaultValue={patient.assignedDoctor?._id || ""}
                onChange={(event) => assignDoctor(patient._id, event.target.value)}
              >
                <option value="">Unassigned</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            ) : (
              patient.assignedDoctor?.name || "Unassigned"
            ),
            role === "admin" ? (
              <span className="row-actions">
                <button className="secondary-button small" onClick={() => updatePatient(patient)}>
                  Update
                </button>
                <button className="danger-button small" onClick={() => removePatient(patient._id)}>
                  Delete
                </button>
              </span>
            ) : (
              "Clinical view"
            )
          ])}
        />
      </section>
    </AppShell>
  );
}
