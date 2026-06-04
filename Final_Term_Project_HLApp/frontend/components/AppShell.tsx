"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  Pill,
  Stethoscope,
  Users
} from "lucide-react";
import { clearSession, getSession, SessionUser } from "@/lib/api";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "doctor", "patient"] },
  { href: "/doctors", label: "Doctors", icon: Stethoscope, roles: ["admin", "patient"] },
  { href: "/patients", label: "Patients", icon: Users, roles: ["admin", "doctor"] },
  { href: "/appointments", label: "Appointments", icon: CalendarDays, roles: ["admin", "doctor", "patient"] },
  { href: "/treatments", label: "Treatments", icon: FileText, roles: ["admin", "doctor", "patient"] },
  { href: "/prescriptions", label: "Prescriptions", icon: Pill, roles: ["admin", "doctor", "patient"] },
  { href: "/notifications", label: "Notifications", icon: Bell, roles: ["admin", "doctor", "patient"] }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) router.replace("/login");
    else setUser(session.user);
  }, [router]);

  if (!user) return null;

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div className="sidebar-head">
          <Link className="brand-row" href="/dashboard">
            <div className="brand-mark">
              <img className="brand-logo" src="/logon.png" alt="HealthLink logo" />
            </div>
            <span>HealthLink</span>
          </Link>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
        </div>
        <div className="sidebar-caption">Clinical operations</div>
        <nav>
          {nav
            .filter((item) => item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} className={pathname === item.href ? "active" : ""} href={item.href}>
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
        </nav>
        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{user.role} workspace</span>
            <h2>{user.name}</h2>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="user-pill">
              <span>{user.email}</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>
        </header>
        <section className="quick-strip" aria-label="Quick actions">
          <Link href="/appointments">
            <CalendarDays size={18} />
            <span>{user.role === "patient" ? "Book appointment" : "Review appointments"}</span>
          </Link>
          <Link href={user.role === "patient" ? "/prescriptions" : "/treatments"}>
            <FileText size={18} />
            <span>{user.role === "patient" ? "View prescriptions" : "Update treatment"}</span>
          </Link>
          <Link href="/notifications">
            <Bell size={18} />
            <span>Notification center</span>
          </Link>
        </section>
        {children}
      </main>
    </div>
  );
}
