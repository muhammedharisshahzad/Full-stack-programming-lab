"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import DataTable from "@/components/DataTable";
import Toast from "@/components/Toast";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toast, setToast] = useState("");

  async function load() {
    const result = await api<any[]>("/notifications");
    if (result.ok) setNotifications(result.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function simulate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const result = await api("/notifications/simulate-mobile", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form))
    });
    setToast(result.ok ? "Mobile alert simulated" : result.message || "Alert failed");
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
          <h1>Notifications</h1>
          <p>Appointment confirmations, medication reminders, follow-up alerts, and simulated mobile messages.</p>
        </div>
        <form className="inline-form" onSubmit={simulate}>
          <input name="title" placeholder="Alert title" required />
          <input name="message" placeholder="Mobile alert message" required />
          <select name="type">
            <option value="appointment">Appointment</option>
            <option value="medication">Medication</option>
            <option value="follow-up">Follow-up</option>
          </select>
          <button className="primary-button">Send simulation</button>
        </form>
        <DataTable
          columns={["Title", "Message", "Type", "Channel", "Status"]}
          rows={notifications.map((item) => [item.title, item.message, item.type, item.channel, item.status])}
        />
      </section>
    </AppShell>
  );
}
