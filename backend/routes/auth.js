const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/auth");

// @route  POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, company, headline } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const allowedRole = ["jobseeker", "employer"].includes(role) ? role : "jobseeker";

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
      company: allowedRole === "employer" ? company || "" : "",
      headline: allowedRole === "jobseeker" ? headline || "" : "",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      headline: user.headline,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// @route  POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      headline: user.headline,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// @route  GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// @route  PUT /api/auth/me
router.put("/me", protect, async (req, res) => {
  try {
    const { name, company, headline, skills, resumeText } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (company !== undefined) user.company = company;
    if (headline !== undefined) user.headline = headline;
    if (skills !== undefined) user.skills = skills;
    if (resumeText !== undefined) user.resumeText = resumeText;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Could not update profile", error: err.message });
  }
});

module.exports = router;
