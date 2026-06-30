require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const users = [
    { username: "DEO10001", password: "Deo@1234", role: "RECEIPT" },
    { username: "DEO10002",     password: "Deo@5678",     role: "ACKNOWLEDGE" },
    { username: "DEO10003", password: "Deo@9012", role: "REPORTS" },
  ];
  for (const u of users) {
    const existing = await User.findOne({ username: u.username });

    if (existing) {
      console.log(`User already exists: ${u.username} (${existing.role})`);
      continue;
    }

    const passwordHash = await bcrypt.hash(u.password, 10);

    await User.create({
      username: u.username,
      passwordHash,
      role: u.role,
    });

    console.log(`Created: ${u.username} (${u.role})`);
  }

  await mongoose.disconnect();
  console.log("Seeding done.");
}

run().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});