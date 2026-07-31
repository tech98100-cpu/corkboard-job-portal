import React from "react";

export default function Footer() {
  return (
    <footer className="felt" style={{ marginTop: 60, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="container" style={{ padding: "28px 24px", color: "#cfc7ac", fontSize: "0.85rem" }}>
        <span className="meta">The Corkboard — a job board built one index card at a time.</span>
      </div>
    </footer>
  );
}
