import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import { Loader } from "../components/Loader";

export default function Home() {
  const [pinned, setPinned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs?limit=6")
      .then(({ data }) => setPinned(data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
    <section
        style={{
          padding: "90px 0 110px",
          position: "relative",
          backgroundImage:
            "linear-gradient(120deg, rgba(20,40,28,0.92) 0%, rgba(36,64,44,0.85) 55%, rgba(20,40,28,0.7) 100%), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=70')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Est. this week — pinned daily</span>
          <h1 style={{ color: "var(--card-cream)", fontSize: "clamp(2.2rem, 5vw, 3.4rem)", marginTop: 10 }}>
            Every good job starts life as a note on a board.
          </h1>
          <p style={{ color: "#f1ecd9", fontSize: "1.1rem", maxWidth: 560, marginTop: 4 }}>
            The Corkboard is a job listing, not a job algorithm. Employers pin real openings.
            You read them, you apply, someone writes back. No feeds, no noise.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            <Link to="/jobs" className="btn btn-primary">Read the board</Link>
            <Link to="/register" className="btn btn-outline">Pin an opening</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "50px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
          <h2 style={{ color: "var(--card-cream)" }}>Freshly pinned</h2>
          <Link to="/jobs" className="meta" style={{ color: "var(--gold)" }}>See the whole board →</Link>
        </div>

        {loading ? (
          <Loader label="Unpinning the latest notes…" />
        ) : pinned.length === 0 ? (
          <p style={{ color: "#e6dfcb" }}>The board is empty right now — check back soon.</p>
        ) : (
          <div style={gridStyle}>
            {pinned.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className="container" style={{ padding: "50px 24px 90px" }}>
        <div className="card-cream-panel" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          <Feature
            title="Employers write, AI drafts"
            body="Give three bullet points about a role and let Gemini draft the full posting. Edit anything before it goes up."
          />
          <Feature
            title="No dead listings"
            body="Postings close themselves off from new applicants the moment a role is filled — nobody applies into a void."
          />
          <Feature
            title="One board, three desks"
            body="Job seekers read and apply, employers pin and manage, admins keep the board honest — one home for all three."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, body }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.05rem" }}>{title}</h3>
      <p style={{ fontSize: "0.92rem", color: "var(--ink-soft)" }}>{body}</p>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "26px 22px",
};
