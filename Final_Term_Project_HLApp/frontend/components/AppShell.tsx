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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) router.replace("/login");
    else setUser(session.user);
  }, [router]);

  useEffect(() => {
    setSidebarCollapsed(localStorage.getItem("healthlink_sidebar") === "collapsed");
  }, []);

  if (!user) return null;

  function logout() {
    clearSession();
    router.push("/login");
  }

  function toggleSidebar() {
    setSidebarCollapsed((value) => {
      const nextValue = !value;
      localStorage.setItem("healthlink_sidebar", nextValue ? "collapsed" : "expanded");
      return nextValue;
    });
  }

  return (
    <div className={`app-frame ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <Link className="brand-row" href="/dashboard">
            <img className="full-brand-logo sidebar-full-logo" src="/fulllogo.png" alt="HealthLink" />
          </Link>
          <button
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="sidebar-toggle"
            onClick={toggleSidebar}
            type="button"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        <span className={`role-badge ${user.role}`}>{user.role}</span>
        <div className="sidebar-caption">Clinical operations</div>
        <nav>
          {nav
            .filter((item) => item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  className={pathname === item.href ? "active" : ""}
                  href={item.href}
                  title={item.label}
                >
                  <Icon size={18} />
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
        </nav>
        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          <span className="nav-label">Logout</span>
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
