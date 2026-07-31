import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  jobseeker: "/dashboard/seeker",
  employer: "/dashboard/employer",
  admin: "/dashboard/admin",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker", company: "", headline: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await register(form);
      navigate(dashboardPath[data.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 24px", maxWidth: 460 }}>
      <div className="card-cream-panel">
        <span className="eyebrow">Pull up a chair</span>
        <h2>Create your account</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>I am joining as</label>
            <select value={form.role} onChange={update("role")}>
              <option value="jobseeker">A job seeker</option>
              <option value="employer">An employer</option>
            </select>
          </div>
          <div className="field">
            <label>Full name</label>
            <input required value={form.name} onChange={update("name")} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={update("email")} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={update("password")} />
          </div>

          {form.role === "employer" && (
            <div className="field">
              <label>Company name</label>
              <input value={form.company} onChange={update("company")} placeholder="e.g. Riverbend Studio" />
            </div>
          )}

          {form.role === "jobseeker" && (
            <div className="field">
              <label>Headline (optional)</label>
              <input value={form.headline} onChange={update("headline")} placeholder="e.g. Frontend Developer" />
            </div>
          )}

          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Cutting your index card…" : "Create Account"}
          </button>
        </form>

        <p className="hint" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login" style={{ color: "var(--pin-navy)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
