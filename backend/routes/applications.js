const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/auth");

// @route  POST /api/applications  (jobseeker applies to a job)
router.post("/", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const { jobId, coverNote, resumeText } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") {
      return res.status(400).json({ message: "This listing is no longer accepting applications" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverNote: coverNote || "",
      resumeText: resumeText || req.user.resumeText || "",
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    res.status(500).json({ message: "Could not submit application", error: err.message });
  }
});

// @route  GET /api/applications/mine  (jobseeker's own applications)
router.get("/mine", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location jobType status")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your applications", error: err.message });
  }
});

// @route  GET /api/applications/job/:jobId  (employer views applicants for their job)
router.get("/job/:jobId", protect, authorize("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only view applicants for your own listings" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email headline skills resumeText")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch applicants", error: err.message });
  }
});

// @route  PUT /api/applications/:id/status  (employer updates applicant status)
router.put("/:id/status", protect, authorize("employer"), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only manage applicants for your own listings" });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Could not update status", error: err.message });
  }
});

module.exports = router;
