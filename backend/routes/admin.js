const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

// @route  GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, jobseekers, employers, totalJobs, openJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "employer" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Application.countDocuments(),
    ]);
    res.json({ totalUsers, jobseekers, employers, totalJobs, openJobs, totalApplications });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch stats", error: err.message });
  }
});

// @route  GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch users", error: err.message });
  }
});

// @route  PUT /api/admin/users/:id/toggle-active
router.put("/users/:id/toggle-active", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Could not update user", error: err.message });
  }
});

// @route  GET /api/admin/jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "name company").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch jobs", error: err.message });
  }
});

// @route  PUT /api/admin/jobs/:id/toggle-flag
router.put("/jobs/:id/toggle-flag", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.isFlagged = !job.isFlagged;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Could not update job", error: err.message });
  }
});

// @route  DELETE /api/admin/jobs/:id
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    await job.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete job", error: err.message });
  }
});

module.exports = router;
