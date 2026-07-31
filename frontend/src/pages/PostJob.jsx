import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const TONES = ["Professional and friendly", "Casual and upbeat", "Formal and corporate", "Bold and energetic"];

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(user?.company || "");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState(TONES[0]);

  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Add a job title first — the AI needs something to write about.");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/generate-description", {
        title,
        company,
        location,
        jobType,
        keywords,
        tone,
      });
      setDescription(data.description);
      setAiGenerated(true);
    } catch (err) {
      setError(err.response?.data?.message || "The AI couldn't draft a description right now.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post("/jobs", {
        title,
        company,
        location,
        jobType,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        description,
        requirements,
        keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        aiGenerated,
        isPinned,
      });
      navigate(`/jobs/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post this job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: "44px 24px 90px", maxWidth: 760 }}>
      <span className="eyebrow">New index card</span>
      <h1 style={{ color: "var(--card-cream)" }}>Pin a New Job</h1>

      <div className="card-cream-panel" style={{ marginTop: 20 }}>
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label>Job title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
            </div>
            <div className="field">
              <label>Company</label>
              <input required value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="field">
              <label>Location</label>
              <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote / Lahore" />
            </div>
            <div className="field">
              <label>Job type</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Salary min (optional)</label>
              <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
            </div>
            <div className="field">
              <label>Salary max (optional)</label>
              <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
            </div>
          </div>

          <div style={{ background: "var(--card-cream-dim)", borderRadius: 8, padding: 18, margin: "10px 0 22px" }}>
            <span className="eyebrow" style={{ color: "var(--pin-navy)" }}>✦ AI Description Generator</span>
            <p className="hint" style={{ margin: "6px 0 12px" }}>
              Give a few keywords and a tone — Gemini drafts the full posting. You can edit every word after.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Key skills / keywords (comma separated)</label>
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button type="button" className="btn btn-navy btn-sm" style={{ marginTop: 14 }} onClick={handleGenerate} disabled={generating}>
              {generating ? "Drafting with Gemini…" : "✦ Generate Description"}
            </button>
          </div>

          <div className="field">
            <label>Description {aiGenerated && <span className="hint">(AI-drafted — edit freely)</span>}</label>
            <textarea
              required
              rows={9}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setAiGenerated(false); }}
              placeholder="Describe the role, responsibilities and what makes it a great opportunity…"
            />
          </div>

          <div className="field">
            <label>Additional requirements (optional)</label>
            <textarea rows={4} value={requirements} onChange={(e) => setRequirements(e.target.value)} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", marginBottom: 20 }}>
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
            Mark as Urgent (gets a red pushpin and floats to the top of the board)
          </label>

          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Pinning to the board…" : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
