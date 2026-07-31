import React, { useMemo } from "react";
import { Link } from "react-router-dom";

function formatSalary(min, max) {
  if (!min && !max) return null;
  const fmt = (n) => `$${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min || max);
}

export default function JobCard({ job }) {
  // Deterministic slight tilt per card, so the board looks organically pinned, not uniform.
  const tilt = useMemo(() => {
    const seed = (job._id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return ((seed % 5) - 2) * 0.6;
  }, [job._id]);

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const posted = new Date(job.createdAt);
  const daysAgo = Math.max(0, Math.floor((Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <Link to={`/jobs/${job._id}`} style={{ display: "block" }}>
      <div className="index-card" style={{ "--tilt": `${tilt}deg` }}>
        <span className={`pushpin ${job.isPinned ? "" : "navy"}`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <h3 style={{ fontSize: "1.15rem" }}>{job.title}</h3>
          {job.isPinned && <span className="stamp">Urgent</span>}
        </div>
        <p style={{ fontWeight: 600, margin: "2px 0 10px", color: "var(--pin-navy)" }}>{job.company}</p>

        <div className="meta" style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", marginBottom: 10 }}>
          <span>📍 {job.location}</span>
          <span>🗂 {job.jobType}</span>
          {salary && <span>💵 {salary}</span>}
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
          {job.description?.slice(0, 110)}
          {job.description?.length > 110 ? "…" : ""}
        </p>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="meta">Pinned {daysAgo === 0 ? "today" : `${daysAgo}d ago`}</span>
          {job.aiGenerated && <span className="meta" title="Description assisted by AI">✦ AI-drafted</span>}
        </div>
      </div>
    </Link>
  );
}
