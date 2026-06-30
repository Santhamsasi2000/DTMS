const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const router = express.Router();

const ALLOWED_ROLES = ["RECEIPT", "ACKNOWLEDGE", "REPORTS"];

router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body || {};

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Username, password and role are required" });
    }

    if (!ALLOWED_ROLES.includes(role))
    {
      return res.status(400).json({ message: "Invalid Role"});
    }

    const user = await User.findOne({ username: username.trim(), role }); 
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username }, 
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;