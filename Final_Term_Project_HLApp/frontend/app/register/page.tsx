"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BriefcaseMedical,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { api, saveSession } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const result = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        phone: form.get("phone"),
        role,
        age: Number(form.get("age") || 0),
        gender: form.get("gender") || "other",
        specialization: form.get("specialization"),
        qualification: form.get("qualification")
      })
    });

    setLoading(false);
    if (!result.ok) return setMessage(result.message || "Registration failed");

    saveSession(result.data);
    router.push("/dashboard");
  }

  return (
    <main className="auth-shell professional-auth">
      <section className="auth-layout register-layout">
        <aside className="auth-info-panel">
          <div className="brand-row">
            <img className="full-brand-logo auth-full-logo" src="/fulllogo.png" alt="HealthLink" />
          </div>
          <div>
            <p className="eyebrow">Create your workspace</p>
            <h1>Start with real user data.</h1>
            <p>
              Register as a patient, doctor, or administrator. The system builds the matching profile from
              the information you enter here.
            </p>
          </div>
          <div className="auth-proof-list">
            <span>Clean role-based dashboard after signup</span>
            <span>Encrypted password storage with bcrypt</span>
            <span>JWT session for protected API access</span>
          </div>
        </aside>

        <form className="auth-card pro wide" onSubmit={handleSubmit}>
          <div className="auth-card-head">
            <span className="auth-kicker">Account setup</span>
            <h2>Create account</h2>
            <p>Enter real details for the user who will use this dashboard.</p>
          </div>

          <div className="role-selector" aria-label="Choose role">
            {[
              { key: "patient", label: "Patient", icon: UserRound },
              { key: "doctor", label: "Doctor", icon: BriefcaseMedical },
              { key: "admin", label: "Admin", icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={role === item.key ? "selected" : ""}
                  key={item.key}
                  onClick={() => setRole(item.key)}
                  type="button"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="form-grid">
            <label>
              Full name
              <div className="input-shell">
                <UserRound size={18} />
                <input name="name" placeholder="Full legal name" required />
              </div>
            </label>
            <label>
              Email address
              <div className="input-shell">
                <Mail size={18} />
                <input name="email" type="email" placeholder="name@hospital.com" required />
              </div>
            </label>
            <label>
              Phone
              <div className="input-shell">
                <Phone size={18} />
                <input name="phone" placeholder="+92 300 0000000" required />
              </div>
            </label>
            <label>
              Password
              <div className="input-shell">
                <LockKeyhole size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="ghost-icon"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
          </div>

          <div className="form-grid compact-grid">
            {role === "patient" && (
              <>
                <label>
                  Age
                  <input name="age" type="number" min={0} placeholder="Age" required />
                </label>
                <label>
                  Gender
                  <select name="gender">
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </>
            )}

            {role === "doctor" && (
              <>
                <label>
                  Specialization
                  <input name="specialization" placeholder="Specialization" required />
                </label>
                <label>
                  Qualification
                  <input name="qualification" placeholder="Qualification" required />
                </label>
              </>
            )}
          </div>

          {message && <div className="alert error">{message}</div>}
          <button className="primary-button full auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <div className="auth-switch">
            <span>Already registered?</span>
            <Link href="/login">Sign in</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
