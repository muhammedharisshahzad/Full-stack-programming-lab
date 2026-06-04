import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="public-shell">
      <section className="public-panel">
        <div className="brand-row">
          <div className="brand-mark">
            <img className="brand-logo" src="/logon.png" alt="HealthLink logo" />
          </div>
          <span>HealthLink</span>
        </div>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Secure hospital operations platform</p>
            <h1>HealthLink</h1>
            <p className="hero-copy">
              A structured appointment, treatment, prescription, and follow-up system for administrators,
              doctors, and patients.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/login">
                Sign in <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button" href="/register">
                Create account
              </Link>
            </div>
          </div>
          <div className="status-board" aria-label="Platform status">
            <div className="metric-card">
              <CalendarCheck />
              <span>Appointments</span>
              <strong>Managed</strong>
            </div>
            <div className="metric-card">
              <ShieldCheck />
              <span>Access</span>
              <strong>JWT secured</strong>
            </div>
            <div className="metric-wide">
              <span>Treatment cycle</span>
              <strong>Booking, consultation, prescription, follow-up</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
