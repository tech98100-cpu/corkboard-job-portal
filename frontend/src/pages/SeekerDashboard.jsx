import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Loader, StatusBadge } from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export default function SeekerDashboard() {
  const { user, updateUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [headline, setHeadline] = useState(user?.headline || "");
  const [skills, setSkills] = useState((user?.skills || []).join(", "));
  const [resumeText, setResumeText] = useState(user?.resumeText || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get("/applications/mine")
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/auth/me", {
      headline,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      resumeText,
    });
    updateUser(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container" style={{ padding: "44px 24px 80px", display: "grid", gridTemplateColumns: "1.1fr 1.4fr", gap: 28 }}>
      <div className="card-cream-panel" style={{ alignSelf: "start" }}>
        <span className="eyebrow">Your card</span>
        <h2>Profile</h2>
        {saved && <div className="success-banner">Profile updated.</div>}
        <form onSubmit={saveProfile}>
          <div className="field">
            <label>Headline</label>
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Backend Developer" />
          </div>
          <div className="field">
            <label>Skills (comma separated)</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, SQL" />
          </div>
          <div className="field">
            <label>Resume summary</label>
            <textarea rows={7} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste a short summary of your experience — this gets sent with each application." />
          </div>
          <button className="btn btn-navy">Save Profile</button>
        </form>
      </div>

      <div>
        <span className="eyebrow" style={{ color: "var(--gold)" }}>Tracked on the board</span>
        <h2 style={{ color: "var(--card-cream)", marginBottom: 20 }}>My Applications</h2>

        {loading ? (
          <Loader />
        ) : applications.length === 0 ? (
          <p style={{ color: "#e6dfcb" }}>
            No applications yet. <Link to="/jobs" style={{ color: "var(--gold)" }}>Go find a listing</Link> to apply to.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {applications.map((app) => (
              <div key={app._id} className="index-card" style={{ "--tilt": "0deg" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem" }}>{app.job?.title || "Listing removed"}</h3>
                    <p className="meta" style={{ margin: "2px 0" }}>{app.job?.company} · {app.job?.location}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <p className="meta" style={{ marginTop: 8 }}>Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
