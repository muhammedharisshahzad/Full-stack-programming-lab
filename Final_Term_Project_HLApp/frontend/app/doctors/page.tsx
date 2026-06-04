"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const role = useSessionUser()?.role;

  async function load() {
    const result = await api<any[]>("/doctors");
    if (result.ok) setDoctors(result.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createDoctor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const result = await api("/doctors", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form))
    });
    setToast(result.ok ? "Doctor added successfully" : result.message || "Could not add doctor");
    if (result.ok) {
      formElement.reset();
      load();
    }
  }

  async function removeDoctor(id: string) {
    if (!confirm("Delete this doctor record?")) return;
    const result = await api(`/doctors/${id}`, { method: "DELETE" });
    setToast(result.ok ? "Doctor deleted" : result.message || "Delete failed");
    if (result.ok) load();
  }

  async function updateDoctor(doctor: any) {
    const phone = prompt("Update phone number", doctor.phone || "");
    if (phone === null) return;
    const fee = prompt("Update consultation fee", String(doctor.consultationFee || 0));
    if (fee === null) return;

    const result = await api(`/doctors/${doctor._id}`, {
      method: "PUT",
      body: JSON.stringify({ phone, consultationFee: Number(fee) })
    });
    setToast(result.ok ? "Doctor updated successfully" : result.message || "Update failed");
    if (result.ok) load();
  }

  return (
    <AppShell>
      <section className="page-section">
        <Toast message={toast} />
        <div className="section-heading">
          <h1>Doctors</h1>
          <p>Manage specializations, availability, and hospital doctor profiles.</p>
        </div>
        {role === "admin" && (
          <form className="inline-form" onSubmit={createDoctor}>
            <input name="name" placeholder="Doctor name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="phone" placeholder="Phone" required />
            <input name="specialization" placeholder="Specialization" required />
            <input name="qualification" placeholder="Qualification" required />
            <button className="primary-button">Add</button>
          </form>
        )}
        <DataTable
          columns={["Name", "Specialization", "Experience", "Fee", "Status", "Action"]}
          rows={doctors.map((doctor) => [
            doctor.name,
            doctor.specialization,
            `${doctor.experienceYears || 0} years`,
            `Rs. ${doctor.consultationFee || 0}`,
            doctor.status,
            role === "admin" ? (
              <span className="row-actions">
                <button className="secondary-button small" onClick={() => updateDoctor(doctor)}>
                  Update
                </button>
                <button className="danger-button small" onClick={() => removeDoctor(doctor._id)}>
                  Delete
                </button>
              </span>
            ) : (
              "Available"
            )
          ])}
        />
      </section>
    </AppShell>
  );
}
