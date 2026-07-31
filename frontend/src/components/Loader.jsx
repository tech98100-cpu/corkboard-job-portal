import React from "react";

export function Loader({ label = "Loading…" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--card-cream)", padding: "40px 0" }}>
      <span
        style={{
          width: 16,
          height: 16,
          border: "3px solid rgba(250,246,236,0.3)",
          borderTopColor: "var(--gold)",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span className="meta" style={{ color: "#e6dfcb" }}>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const statusColors = {
  Submitted: "#5c5445",
  Reviewed: "#2c4a6e",
  Shortlisted: "#c9a227",
  Rejected: "#b23a2e",
  Hired: "#24402c",
};

export function StatusBadge({ status }) {
  const color = statusColors[status] || "#5c5445";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#fff",
        background: color,
        padding: "3px 9px",
        borderRadius: 4,
      }}
    >
      {status}
    </span>
  );
}
