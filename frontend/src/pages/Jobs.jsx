import React, { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import { Loader } from "../components/Loader";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const fetchJobs = (targetPage = 1) => {
    setLoading(true);
    api
      .get("/jobs", { params: { q, location, jobType, page: targetPage, limit: 9 } })
      .then(({ data }) => {
        setJobs(data.jobs);
        setTotal(data.total);
        setPage(data.page);
        setPages(data.pages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div className="container" style={{ padding: "44px 24px 80px" }}>
      <span className="eyebrow">The full board</span>
      <h1 style={{ color: "var(--card-cream)", marginBottom: 24 }}>Browse open pins</h1>

      <form onSubmit={handleSearch} className="card-cream-panel" style={filterBar}>
        <input
          placeholder="Title, company, keyword…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />
        <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={inputStyle}>
          <option value="">Any job type</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-navy">Search</button>
      </form>

      <p className="meta" style={{ color: "#e6dfcb", margin: "18px 0" }}>
        {loading ? "Searching the board…" : `${total} listing${total === 1 ? "" : "s"} pinned`}
      </p>

      {loading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <p style={{ color: "#e6dfcb" }}>No pins match that search yet. Try loosening a filter.</p>
      ) : (
        <>
          <div style={gridStyle}>
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {pages > 1 && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 34 }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchJobs(p)}
                  className={p === page ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const filterBar = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr auto",
  gap: 12,
  padding: 18,
};

const inputStyle = {
  border: "1.5px solid var(--line)",
  borderRadius: 5,
  padding: "10px 12px",
  background: "#fff",
  color: "var(--ink)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "26px 22px",
};
