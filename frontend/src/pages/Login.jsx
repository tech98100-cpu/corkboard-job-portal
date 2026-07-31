import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  jobseeker: "/dashboard/seeker",
  employer: "/dashboard/employer",
  admin: "/dashboard/admin",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(dashboardPath[data.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 24px", maxWidth: 440 }}>
      <div className="card-cream-panel">
        <span className="eyebrow">Welcome back</span>
        <h2>Log in to the board</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Checking the guestbook…" : "Log In"}
          </button>
        </form>

        <p className="hint" style={{ marginTop: 16 }}>
          New here? <Link to="/register" style={{ color: "var(--pin-navy)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
