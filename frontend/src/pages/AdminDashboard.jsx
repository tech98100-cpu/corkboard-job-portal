import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Loader } from "../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [s, u, j] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/jobs"),
    ]);
    setStats(s.data);
    setUsers(u.data);
    setJobs(j.data);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const toggleUser = async (id) => {
    const { data } = await api.put(`/admin/users/${id}/toggle-active`);
    setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
  };

  const toggleFlag = async (id) => {
    const { data } = await api.put(`/admin/jobs/${id}/toggle-flag`);
    setJobs((prev) => prev.map((j) => (j._id === id ? data : j)));
  };

  const removeJob = async (id) => {
    if (!window.confirm("Remove this listing from the board?")) return;
    await api.delete(`/admin/jobs/${id}`);
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  return (
    <div className="container" style={{ padding: "44px 24px 90px" }}>
      <span className="eyebrow">Admin desk</span>
      <h1 style={{ color: "var(--card-cream)" }}>Keeping the board honest</h1>

      {loading || !stats ? (
        <Loader />
      ) : (
        <>
          <div style={statGrid}>
            <StatCard label="Total users" value={stats.totalUsers} />
            <StatCard label="Job seekers" value={stats.jobseekers} />
            <StatCard label="Employers" value={stats.employers} />
            <StatCard label="Total listings" value={stats.totalJobs} />
            <StatCard label="Open listings" value={stats.openJobs} />
            <StatCard label="Applications" value={stats.totalApplications} />
          </div>

          <div style={{ display: "flex", gap: 10, margin: "30px 0 18px" }}>
            <button className={tab === "users" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"} onClick={() => setTab("users")}>
              Users
            </button>
            <button className={tab === "jobs" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"} onClick={() => setTab("jobs")}>
              Listings
            </button>
          </div>

          {tab === "users" && (
            <div className="card-cream-panel">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                      <td>{u.isActive ? "Active" : "Deactivated"}</td>
                      <td>
                        {u.role !== "admin" && (
                          <button className="btn btn-ghost btn-sm" onClick={() => toggleUser(u._id)}>
                            {u.isActive ? "Deactivate" : "Reactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "jobs" && (
            <div className="card-cream-panel">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Title</th><th>Employer</th><th>Status</th><th>Flag</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j._id}>
                      <td>{j.title}</td>
                      <td>{j.employer?.company || j.employer?.name}</td>
                      <td>{j.status}</td>
                      <td>{j.isFlagged ? "🚩 Flagged" : "—"}</td>
                      <td style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleFlag(j._id)}>
                          {j.isFlagged ? "Unflag" : "Flag"}
                        </button>
                        <button className="btn btn-sm" style={{ background: "transparent", color: "var(--pin-red)", border: "1.5px solid var(--pin-red)" }} onClick={() => removeJob(j._id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="index-card" style={{ "--tilt": "0deg", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700 }}>{value}</div>
      <div className="meta">{label}</div>
    </div>
  );
}

const statGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 16,
  marginTop: 24,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
};
