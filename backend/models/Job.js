const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time",
    },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },
    keywords: [{ type: String, trim: true }],
    aiGenerated: { type: Boolean, default: false }, // was the description AI-assisted
    status: { type: String, enum: ["open", "closed"], default: "open" },
    isPinned: { type: Boolean, default: false }, // featured / urgent listing (red pushpin)
    isFlagged: { type: Boolean, default: false }, // flagged by admin for review
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", company: "text", location: "text", keywords: "text" });

module.exports = mongoose.model("Job", jobSchema);
