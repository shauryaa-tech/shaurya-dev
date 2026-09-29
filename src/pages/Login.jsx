import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../components/Logo";
import "../admin.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }
      localStorage.setItem("sps-admin-token", data.token);
      toast.success("Welcome back");
      navigate("/admin");
    } catch {
      setError("Couldn't reach the server");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="adm-page" data-testid="login-page">
      <form className="adm-login glass" onSubmit={submit} data-testid="login-form">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <Logo />
          <span className="font-display font-bold text-white">
            SHAURYA<span className="text-neon">.DEV</span>
          </span>
        </div>
        <p className="adm-kicker">Admin</p>
        <h1 className="adm-title" style={{ fontSize: "2.4rem" }}>SIGN IN</h1>
        <p className="adm-sub">Edit jobs, publish projects, and read site traffic.</p>

        <div className="adm-field" style={{ marginTop: 22 }}>
          <label htmlFor="admin-user">Username</label>
          <input
            id="admin-user"
            data-testid="login-username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            data-testid="login-password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <p className="adm-error" data-testid="login-error">{error}</p>}
        <button className="adm-btn" type="submit" disabled={busy} data-testid="login-submit">
          {busy ? "Checking…" : "Enter dashboard"}
        </button>
        <Link to="/" className="adm-back">
          ← Back to portfolio
        </Link>
      </form>
    </main>
  );
}
