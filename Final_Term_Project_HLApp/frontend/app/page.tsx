import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  ClipboardList,
  FileText,
  Fingerprint,
  LayoutDashboard,
  LogIn,
  LockKeyhole,
  MessageSquareText,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  UsersRound
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: CalendarCheck,
      title: "Appointment control",
      text: "Book, review, approve, and follow patient visits from one clear operational queue."
    },
    {
      icon: ClipboardList,
      title: "Treatment records",
      text: "Keep consultation notes, progress status, prescriptions, and follow-ups connected."
    },
    {
      icon: ShieldCheck,
      title: "Protected access",
      text: "Role based dashboards keep admins, doctors, and patients focused on the right data."
    }
  ];

  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Primary navigation">
        <Link className="brand-row" href="/">
          <img className="full-brand-logo nav-full-logo" src="/fulllogo.png" alt="HealthLink" />
        </Link>
        <div className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#security">Security</a>
        </div>
        <div className="nav-actions">
          <Link className="secondary-button" href="/login">
            Sign in
          </Link>
          <Link className="primary-button" href="/register">
            Create account
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-content">
          <h1>Secure hospital operations platform</h1>
          <p className="hero-copy">
            HealthLink is a professional healthcare management system for appointments, treatments, prescriptions,
            patient records, and follow-up communication.
          </p>
          <div className="hero-actions">
            <Link className="primary-button hero-button" href="/login">
              <LogIn size={18} /> Sign in
            </Link>
            <Link className="secondary-button hero-button" href="/register">
              <UserPlus size={18} /> Create account
            </Link>
          </div>
          <div className="hero-trust-row" aria-label="Platform highlights">
            <span>
              <LockKeyhole size={16} />
              JWT secured
            </span>
            <span>
              <UsersRound size={16} />
              Role based
            </span>
            <span>
              <BellRing size={16} />
              Notifications
            </span>
          </div>
        </div>

        <div className="hero-console" aria-label="HealthLink dashboard preview">
          <div className="console-header">
            <div className="brand-row">
              <img className="full-brand-logo console-full-logo" src="/fulllogo.png" alt="HealthLink" />
            </div>
            <div className="console-search">
              <Search size={15} />
              <span />
            </div>
            <div className="console-tools">
              <Search size={16} />
              <BellRing size={16} />
              <img src="/logon.png" alt="" />
            </div>
          </div>

          <div className="console-body">
            <aside className="console-sidebar" aria-label="Dashboard menu preview">
              {[
                { label: "Dashboard", icon: LayoutDashboard },
                { label: "Appointments", icon: CalendarCheck },
                { label: "Patients", icon: UsersRound },
                { label: "Doctors", icon: Stethoscope },
                { label: "Treatments", icon: ClipboardList },
                { label: "Prescriptions", icon: Pill },
                { label: "Follow-ups", icon: MessageSquareText },
                { label: "Settings", icon: Settings }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div className={index === 0 ? "active" : ""} key={item.label}>
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </aside>

            <div className="console-main">
              <h2>Dashboard</h2>
              <div className="console-grid">
                <div className="console-stat today-stat">
                  <CalendarCheck size={28} />
                  <span>Today</span>
                  <strong>24</strong>
                  <small>Appointments</small>
                </div>
                <div className="console-stat">
                  <span>Clinical operations</span>
                  <strong>Active</strong>
                </div>
                <div className="console-stat">
                  <span>Appointments</span>
                  <strong>Managed</strong>
                </div>
                <div className="console-stat">
                  <span>Doctors</span>
                  <strong>Assigned</strong>
                </div>
                <div className="console-wide">
                  <div>
                    <span>Treatment cycle</span>
                    <strong>Booking, consultation, prescription, follow-up</strong>
                  </div>
                  <div className="cycle-row">
                    <CalendarCheck size={22} />
                    <Stethoscope size={22} />
                    <Pill size={22} />
                    <MessageSquareText size={22} />
                  </div>
                </div>
                <div className="prescription-card">
                  <div>
                    <strong>Prescription ready for patient review</strong>
                    <span>Active</span>
                  </div>
                  <div className="document-preview">
                    <i />
                    <i />
                    <i />
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div className="console-wide approval-card">
                  <div>
                    <strong>Admin approval queue updated</strong>
                    <span />
                    <span />
                  </div>
                  <div className="secure-chip">
                    <ShieldCheck size={28} />
                    <strong>Secure Platform</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="platform">
        <div className="section-heading">
          <h2>Built for real healthcare workflows</h2>
          <span>Platform</span>
          <p>
            HealthLink keeps daily hospital activity structured, searchable, and easier to manage for every
            user role in the system.
          </p>
        </div>
        <div className="landing-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="landing-feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={34} />
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
                <ArrowRight className="feature-arrow" size={18} />
              </article>
            );
          })}
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="section-heading compact">
          <h2>From first booking to follow-up care</h2>
          <span>Workflow</span>
        </div>
        <div className="workflow-steps">
          {[
            { step: "Register user", icon: UserPlus },
            { step: "Book appointment", icon: CalendarCheck },
            { step: "Record treatment", icon: FileText },
            { step: "Send follow-up", icon: MessageSquareText }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div className="workflow-step" key={item.step}>
                <div className="workflow-icon">
                  <Icon size={28} />
                </div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.step}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="security-band" id="security">
        <div>
          <h2>Designed around protected access</h2>
          <span>Security</span>
          <p>
            Login sessions, encrypted passwords, and role-aware dashboards create a cleaner boundary between
            patient, doctor, and admin workspaces.
          </p>
        </div>
        <div className="security-visual" aria-hidden="true">
          <ShieldCheck className="shield-bg" size={122} />
          <div className="laptop-card">
            <LockKeyhole size={34} />
            <span />
            <span />
            <strong>Sign in</strong>
          </div>
          <div className="fingerprint-card">
            <Fingerprint size={34} />
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <h2>Get started</h2>
          <p>Join HealthLink and simplify hospital operations today.</p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button hero-button" href="/login">
            <LogIn size={18} /> Sign in
          </Link>
          <Link className="secondary-button hero-button" href="/register">
            <UserPlus size={18} /> Create account
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="brand-row">
          <img className="full-brand-logo footer-full-logo" src="/fulllogo.png" alt="HealthLink" />
        </div>
        <div className="footer-links">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#security">Security</a>
        </div>
        <span>&copy; Muhammad Haris Shahzad. All rights reserved.</span>
      </footer>
    </main>
  );
}
