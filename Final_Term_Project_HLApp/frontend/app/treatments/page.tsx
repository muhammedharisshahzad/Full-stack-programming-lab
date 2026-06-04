"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";
import { useSessionUser } from "@/lib/useSessionUser";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const role = useSessionUser()?.role;

  async function load() {
    const result = await api<any[]>("/treatments");
    if (result.ok) setTreatments(result.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addFollowUp(id: string) {
    const result = await api(`/treatments/${id}/followups`, {
      method: "POST",
      body: JSON.stringify({
        visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        purpose: "Progress review"
      })
    });
    setToast(result.ok ? "Follow-up scheduled" : result.message || "Could not schedule follow-up");
    if (result.ok) load();
  }

  async function markImproving(id: string) {
    const result = await api(`/treatments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "improving" })
    });
    setToast(result.ok ? "Treatment status updated" : result.message || "Update failed");
    if (result.ok) load();
  }

  return (
    <AppShell>
      <section className="page-section">
        <Toast message={toast} />
        <div className="section-heading">
          <h1>Treatments</h1>
          <p>Track confirmed appointment cases, checkups, progress, and follow-up visits.</p>
        </div>
        <DataTable
          columns={["Patient", "Doctor", "Diagnosis", "Status", "Follow-ups", "Action"]}
          rows={treatments.map((treatment) => [
            treatment.patient?.name || "-",
            treatment.doctor?.name || "-",
            treatment.diagnosis || "Pending diagnosis",
            <span className={`status ${treatment.status}`}>{treatment.status}</span>,
            treatment.followUps?.length || 0,
            role === "doctor" || role === "admin" ? (
              <span className="row-actions">
                <button className="secondary-button small" onClick={() => markImproving(treatment._id)}>
                  Update
                </button>
                <button className="primary-button small" onClick={() => addFollowUp(treatment._id)}>
                  Follow-up
                </button>
              </span>
            ) : (
              "View"
            )
          ])}
        />
      </section>
    </AppShell>
  );
}
