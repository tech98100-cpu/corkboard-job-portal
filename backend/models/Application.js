const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverNote: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Submitted", "Reviewed", "Shortlisted", "Rejected", "Hired"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

// One applicant can only apply once per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
