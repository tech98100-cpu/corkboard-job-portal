const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/auth");

// @route  GET /api/jobs  (public, with search/filter)
router.get("/", async (req, res) => {
  try {
    const { q, location, jobType, page = 1, limit = 9 } = req.query;
    const filter = { status: "open" };

    if (q) {
      filter.$text = { $search: q };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      filter.jobType = jobType;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch jobs", error: err.message });
  }
});

// @route  GET /api/jobs/mine  (employer's own postings)
router.get("/mine", protect, authorize("employer"), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your jobs", error: err.message });
  }
});

// @route  GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name company email");
    if (!job) return res.status(404).json({ message: "This listing has been taken down" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch this job", error: err.message });
  }
});

// @route  POST /api/jobs  (employer only)
router.post("/", protect, authorize("employer"), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      salaryMin,
      salaryMax,
      description,
      requirements,
      keywords,
      aiGenerated,
      isPinned,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "Title, company, location and description are required" });
    }

    const job = await Job.create({
      employer: req.user._id,
      title,
      company,
      location,
      jobType,
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      description,
      requirements: requirements || "",
      keywords: Array.isArray(keywords) ? keywords : [],
      aiGenerated: !!aiGenerated,
      isPinned: !!isPinned,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Could not post job", error: err.message });
  }
});

// @route  PUT /api/jobs/:id  (owner employer only)
router.put("/:id", protect, authorize("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Could not update job", error: err.message });
  }
});

// @route  DELETE /api/jobs/:id  (owner employer or admin)
router.delete("/:id", protect, authorize("employer", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (req.user.role !== "admin" && job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only remove your own listings" });
    }
    await job.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete job", error: err.message });
  }
});

module.exports = router;
