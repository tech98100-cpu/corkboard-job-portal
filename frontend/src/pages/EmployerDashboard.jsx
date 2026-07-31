import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Loader, StatusBadge } from "../components/Loader";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [applicants, setApplicants] = useState({});

  const loadJobs = () => {
    setLoading(true);
    api.get("/jobs/mine").then(({ data }) => setJobs(data)).finally(() => setLoading(false));
  };

  useEffect(loadJobs, []);

  const toggleApplicants = async (jobId) => {
    if (expanded === jobId) {
      setExpanded(null);
      return;
    }
    setExpanded(jobId);
    if (!applicants[jobId]) {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplicants((prev) => ({ ...prev, [jobId]: data }));
    }
  };

  const updateStatus = async (jobId, appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    const { data } = await api.get(`/applications/job/${jobId}`);
    setApplicants((prev) => ({ ...prev, [jobId]: data }));
  };

  const toggleClosed = async (job) => {
    const { data } = await api.put(`/jobs/${job._id}`, { status: job.status === "open" ? "closed" : "open" });
    setJobs((prev) => prev.map((j) => (j._id === job._id ? data : j)));
  };

  const removeJob = async (jobId) => {
    if (!window.confirm("Take this listing off the board for good?")) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  return (
    <div className="container" style={{ padding: "44px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="eyebrow">Your desk</span>
          <h1 style={{ color: "var(--card-cream)" }}>My Postings</h1>
        </div>
        <Link to="/dashboard/employer/post" className="btn btn-primary">+ Pin a New Job</Link>
      </div>

      {loading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <p style={{ color: "#e6dfcb", marginTop: 24 }}>You haven't pinned any listings yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
          {jobs.map((job) => (
            <div key={job._id} className="card-cream-panel">
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ marginBottom: 2 }}>{job.title}</h3>
                  <p className="meta">{job.location} · {job.jobType} · {job.status === "open" ? "Open" : "Closed"}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => toggleApplicants(job._id)}>
                    {expanded === job._id ? "Hide Applicants" : "View Applicants"}
                  </button>
                  <button className="btn btn-outline btn-sm" style={{ color: "var(--ink)", borderColor: "var(--line)" }} onClick={() => toggleClosed(job)}>
                    {job.status === "open" ? "Close Listing" : "Reopen"}
                  </button>
                  <button className="btn btn-sm" style={{ background: "transparent", color: "var(--pin-red)", border: "1.5px solid var(--pin-red)" }} onClick={() => removeJob(job._id)}>
                    Delete
                  </button>
                </div>
              </div>

              {expanded === job._id && (
                <div style={{ marginTop: 18, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                  {!applicants[job._id] ? (
                    <Loader label="Pulling applicant cards…" />
                  ) : applicants[job._id].length === 0 ? (
                    <p className="hint">No applicants yet for this listing.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {applicants[job._id].map((app) => (
                        <div key={app._id} style={{ border: "1px solid var(--line)", borderRadius: 6, padding: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                            <div>
                              <strong>{app.applicant?.name}</strong>
                              <span className="meta" style={{ marginLeft: 8 }}>{app.applicant?.email}</span>
                              {app.applicant?.headline && <p className="meta">{app.applicant.headline}</p>}
                            </div>
                            <StatusBadge status={app.status} />
                          </div>
                          {app.coverNote && <p style={{ fontSize: "0.9rem", marginTop: 8 }}>{app.coverNote}</p>}
                          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                            {["Reviewed", "Shortlisted", "Rejected", "Hired"].map((s) => (
                              <button key={s} className="btn btn-ghost btn-sm" onClick={() => updateStatus(job._id, app._id, s)}>
                                Mark {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
