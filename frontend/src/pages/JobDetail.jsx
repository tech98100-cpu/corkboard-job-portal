import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Loader } from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [coverNote, setCoverNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError(null);
    setMessage(null);
    try {
      await api.post("/applications", { jobId: id, coverNote });
      setMessage("Your application has been pinned to this listing. Good luck!");
      setCoverNote("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: 60 }}><Loader /></div>;
  if (notFound || !job) {
    return (
      <div className="container" style={{ padding: 60, color: "var(--card-cream)" }}>
        <h2>This note has come off the board.</h2>
        <Link to="/jobs" className="btn btn-outline" style={{ marginTop: 16 }}>Back to the board</Link>
      </div>
    );
  }

  const salary =
    job.salaryMin || job.salaryMax
      ? `$${Number(job.salaryMin || 0).toLocaleString()} – $${Number(job.salaryMax || job.salaryMin).toLocaleString()}`
      : null;

  return (
    <div className="container" style={{ padding: "44px 24px 80px", maxWidth: 820 }}>
      <div className="card-cream-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--pin-navy)" }}>{job.jobType}</span>
            <h1 style={{ marginTop: 6 }}>{job.title}</h1>
            <p style={{ fontWeight: 600, color: "var(--pin-navy)", margin: 0 }}>{job.company} · {job.location}</p>
          </div>
          {job.isPinned && <span className="stamp">Urgent</span>}
        </div>

        <div className="meta" style={{ display: "flex", gap: 16, margin: "16px 0", flexWrap: "wrap" }}>
          {salary && <span>💵 {salary}</span>}
          <span>🗓 Pinned {new Date(job.createdAt).toLocaleDateString()}</span>
          {job.status !== "open" && <span className="stamp">Closed</span>}
        </div>

        <h3>About the role</h3>
        <p style={{ whiteSpace: "pre-line" }}>{job.description}</p>

        {job.requirements && (
          <>
            <h3>What we're looking for</h3>
            <p style={{ whiteSpace: "pre-line" }}>{job.requirements}</p>
          </>
        )}

        {job.keywords?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {job.keywords.map((k) => (
              <span key={k} className="meta" style={{ background: "var(--card-cream-dim)", padding: "3px 10px", borderRadius: 20 }}>
                {k}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card-cream-panel" style={{ marginTop: 24 }}>
        <h3>Apply for this role</h3>

        {job.status !== "open" && <p className="hint">This listing is closed to new applications.</p>}

        {!user && job.status === "open" && (
          <p className="hint">
            <Link to="/login" style={{ color: "var(--pin-navy)", fontWeight: 600 }}>Log in</Link> as a job seeker to apply.
          </p>
        )}

        {user && user.role !== "jobseeker" && job.status === "open" && (
          <p className="hint">Only job seeker accounts can apply to listings.</p>
        )}

        {user && user.role === "jobseeker" && job.status === "open" && (
          <form onSubmit={handleApply}>
            {error && <div className="error-banner">{error}</div>}
            {message && <div className="success-banner">{message}</div>}
            <div className="field">
              <label>Cover note (optional)</label>
              <textarea
                rows={5}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="A few lines on why you're a fit…"
              />
            </div>
            <button className="btn btn-primary" disabled={applying}>
              {applying ? "Pinning your application…" : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
