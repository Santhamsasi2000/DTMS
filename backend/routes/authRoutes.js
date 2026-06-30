const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const auth = require("../middleware/auth");

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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

// ME (optional)
router.get("/me", auth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;