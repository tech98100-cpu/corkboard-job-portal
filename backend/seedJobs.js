require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Job = require("./models/Job");

const sampleJobs = [
  {
    title: "Frontend Developer (React)",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 80000,
    salaryMax: 120000,
    description:
      "About the role\nWe're looking for a Frontend Developer to build fast, accessible interfaces for our growing product.\n\nWhat you'll do\n- Build and maintain React components\n- Collaborate with designers on new features\n- Improve performance and accessibility across the app\n\nWhat we're looking for\n- 2+ years with React\n- Comfortable with modern CSS and responsive design\n- Good communication and a portfolio of past work",
    requirements: "React, JavaScript, CSS, Git",
    keywords: ["React", "JavaScript", "CSS"],
    isPinned: true,
  },
  {
    title: "Backend Engineer (Node.js)",
    location: "Karachi, Pakistan",
    jobType: "Full-time",
    salaryMin: 90000,
    salaryMax: 140000,
    description:
      "About the role\nJoin our backend team building the APIs that power our platform.\n\nWhat you'll do\n- Design and maintain REST APIs\n- Work with MongoDB and Express\n- Write clean, tested, documented code\n\nWhat we're looking for\n- Solid Node.js and Express experience\n- Comfortable with MongoDB or similar databases\n- Understanding of authentication and API security",
    requirements: "Node.js, Express, MongoDB",
    keywords: ["Node.js", "MongoDB", "Express"],
    isPinned: false,
  },
  {
    title: "UI/UX Designer",
    location: "Lahore, Pakistan",
    jobType: "Contract",
    salaryMin: 50000,
    salaryMax: 75000,
    description:
      "About the role\nWe need a UI/UX designer to help reimagine our core user flows.\n\nWhat you'll do\n- Design wireframes and high-fidelity mockups\n- Run quick usability checks with real users\n- Work closely with frontend developers on handoff\n\nWhat we're looking for\n- A strong portfolio of shipped product design\n- Comfort with Figma\n- An eye for typography and layout",
    requirements: "Figma, Prototyping, User Research",
    keywords: ["Figma", "UI Design", "UX"],
    isPinned: false,
  },
  {
    title: "Digital Marketing Intern",
    location: "Remote",
    jobType: "Internship",
    salaryMin: 15000,
    salaryMax: 25000,
    description:
      "About the role\nA great entry point into digital marketing — you'll help run real campaigns from day one.\n\nWhat you'll do\n- Assist with social media content and scheduling\n- Track basic campaign metrics\n- Support email marketing efforts\n\nWhat we're looking for\n- Interest in marketing or communications\n- Comfortable writing short, clear copy\n- No experience required, just curiosity",
    requirements: "None — training provided",
    keywords: ["Marketing", "Social Media"],
    isPinned: false,
  },
  {
    title: "DevOps Engineer",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 100000,
    salaryMax: 150000,
    description:
      "About the role\nHelp us scale our infrastructure as we grow.\n\nWhat you'll do\n- Manage CI/CD pipelines\n- Monitor and improve system reliability\n- Automate deployment workflows\n\nWhat we're looking for\n- Experience with Docker and cloud platforms\n- Familiarity with CI/CD tools\n- A calm head during incidents",
    requirements: "Docker, AWS or similar, CI/CD",
    keywords: ["DevOps", "Docker", "AWS"],
    isPinned: true,
  },
  {
    title: "Customer Support Representative",
    location: "Islamabad, Pakistan",
    jobType: "Part-time",
    salaryMin: 30000,
    salaryMax: 45000,
    description:
      "About the role\nBe the friendly voice that helps our customers solve problems fast.\n\nWhat you'll do\n- Respond to customer queries over chat and email\n- Log recurring issues for the product team\n- Keep our help docs up to date\n\nWhat we're looking for\n- Clear written communication\n- Patience and a helpful attitude\n- Basic comfort with support tools",
    requirements: "None — training provided",
    keywords: ["Customer Support", "Communication"],
    isPinned: false,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  let employer = await User.findOne({ email: "demo.employer@corkboard.dev" });
  if (!employer) {
    employer = await User.create({
      name: "Demo Employer",
      email: "demo.employer@corkboard.dev",
      password: "demoPass123",
      role: "employer",
      company: "Riverbend Studio",
    });
    console.log("Created demo employer: demo.employer@corkboard.dev / demoPass123");
  } else {
    console.log("Reusing existing demo employer account.");
  }

  let created = 0;
  for (const job of sampleJobs) {
    const exists = await Job.findOne({ title: job.title, employer: employer._id });
    if (exists) continue;
    await Job.create({ ...job, employer: employer._id, company: employer.company });
    created++;
  }

  console.log(`Done. ${created} new job(s) added to the board.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});