import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "90px 24px", textAlign: "center", color: "var(--card-cream)" }}>
      <h1>This corner of the board is empty.</h1>
      <p style={{ color: "#e6dfcb" }}>The page you're looking for isn't pinned up anywhere.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Back to the board</Link>
    </div>
  );
}
