require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const users = [
    { username: "deo", password: "deo123", role: "DEO" },
    { username: "staff", password: "staff123", role: "STAFF" },
  ];

  for (const u of users) {
    const existing = await User.findOne({ username: u.username });
    if (existing) {
      console.log("User exists:", u.username);
      continue;
    }
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({ username: u.username, passwordHash, role: u.role });
    console.log("Created:", u.username, u.role);
  }

  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});