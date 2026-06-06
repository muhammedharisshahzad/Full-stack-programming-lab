"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { api, saveSession } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });

    setLoading(false);
    if (!result.ok) return setMessage(result.message || "Login failed");

    saveSession(result.data);
    router.push("/dashboard");
  }

  return (
    <main className="auth-shell professional-auth">
      <section className="auth-layout">
        <aside className="auth-info-panel">
          <div className="brand-row">
            <img className="full-brand-logo auth-full-logo" src="/fulllogo.png" alt="HealthLink" />
          </div>
          <div>
            <p className="eyebrow">Secure access</p>
            <h1>Healthcare work, organized.</h1>
            <p>
              Sign in to manage appointments, prescriptions, treatment progress, follow-up visits, and
              patient notifications from one protected workspace.
            </p>
          </div>
          <div className="auth-proof-grid">
            <div>
              <ShieldCheck size={20} />
              <span>JWT protected</span>
            </div>
            <div>
              <LockKeyhole size={20} />
              <span>Role based</span>
            </div>
          </div>
        </aside>

        <form className="auth-card pro" onSubmit={handleSubmit}>
          <div className="auth-card-head">
            <span className="auth-kicker">Welcome back</span>
            <h2>Sign in</h2>
            <p>Use your own registered account credentials.</p>
          </div>

          <label>
            Email address
            <div className="input-shell">
              <Mail size={18} />
              <input name="email" type="email" placeholder="name@hospital.com" required />
            </div>
          </label>

          <label>
            Password
            <div className="input-shell">
              <LockKeyhole size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          {message && <div className="alert error">{message}</div>}
          <button className="primary-button full auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <div className="auth-switch">
            <span>New to HealthLink?</span>
            <Link href="/register">Create account</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
