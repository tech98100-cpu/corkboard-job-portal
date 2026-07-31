const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// @route  POST /api/ai/generate-description
router.post("/generate-description", protect, authorize("employer"), async (req, res) => {
  try {
    const { title, company, location, jobType, keywords, tone } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Job title is required to generate a description" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key is not configured on the server" });
    }

    const prompt = `You are writing a job posting for a job board called "The Corkboard".
Write a clear, well-structured job description in plain text (no markdown symbols like ** or #).

Job title: ${title}
Company: ${company || "Not specified"}
Location: ${location || "Not specified"}
Job type: ${jobType || "Full-time"}
Key skills / keywords to weave in: ${keywords || "none given"}
Tone: ${tone || "professional and friendly"}

Structure the output with these plain-text sections, each on its own line as a heading followed by content:
About the role
What you'll do (3-5 bullet points using a dash "-")
What we're looking for (3-5 bullet points using a dash "-")

Keep the whole thing under 220 words. Do not invent a company backstory beyond what is given. Do not include salary figures.`;

    const geminiRes = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500 },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errBody);
      return res.status(502).json({ message: "Gemini could not generate a description right now", details: errBody });
    }

    const data = await geminiRes.json();
    const description = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n").trim();

    if (!description) {
      return res.status(502).json({ message: "Gemini returned an empty response" });
    }

    res.json({ description });
  } catch (err) {
    console.error("AI generation failed:", err.message);
    res.status(500).json({ message: "AI generation failed", error: err.message });
  }
});

module.exports = router;