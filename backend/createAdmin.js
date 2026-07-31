// One-time script to create an admin account, since the public /register
// endpoint only allows "jobseeker" or "employer" roles by design.
//
// Usage:
//   node createAdmin.js "Admin Name" "admin@example.com" "somePassword123"

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function run() {
  const [name, email, password] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.log('Usage: node createAdmin.js "Admin Name" "admin@example.com" "password123"');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Admin account created for ${email}.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
