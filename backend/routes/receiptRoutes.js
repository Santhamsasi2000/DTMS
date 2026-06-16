const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Receipt = require("../models/ReceiptModel");

// ─── Multer Storage Setup ─────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only PDF, JPG, PNG allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

// ─── POST /api/receipts — Create Receipt ──────────────────────────────────────
router.post("/", upload.array("documents", 10), async (req, res) => {
  try {
    const {
      receiptDate, receiptMode, formType,
      uan, memberId, memberName, mobile,
      establishmentName, group, task, subject,
    } = req.body;

    const documents = (req.files || []).map((f) => ({
      originalName: f.originalname,
      fileName:     f.filename,
      filePath:     f.path,
      mimeType:     f.mimetype,
      size:         f.size,
    }));

    const receipt = await Receipt.create({
      receiptDate,
      receiptMode,
      formType,
      uan,
      memberId,
      memberName,
      mobile,
      establishmentName,
      group,
      task,
      subject,
      documents,
      createdByName: "DEO",
      actionLog: [{ action: "Receipt created", updatedByName: "DEO" }],
    });

    res.status(201).json({ success: true, data: receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/receipts — List All (with search + pagination) ──────────────────
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      status,
      group,
      formType,
      startDate,
      endDate,
      page  = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { taphalNo:         { $regex: search, $options: "i" } },
        { uan:              { $regex: search, $options: "i" } },
        { memberId:         { $regex: search, $options: "i" } },
        { memberName:       { $regex: search, $options: "i" } },
        { establishmentName:{ $regex: search, $options: "i" } },
        { group:            { $regex: search, $options: "i" } },
      ];
    }

    if (status)               query.status   = status;
    if (group)                query.group    = { $regex: group, $options: "i" };
    if (formType)             query.formType = formType;
    if (startDate || endDate) {
      query.receiptDate = {};
      if (startDate) query.receiptDate.$gte = new Date(startDate);
      if (endDate)   query.receiptDate.$lte = new Date(endDate);
    }

    const skip    = (Number(page) - 1) * Number(limit);
    const total   = await Receipt.countDocuments(query);
    const receipts = await Receipt.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: receipts,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/receipts/file/:filename — Download File ─────────────────────────
router.get("/file/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ success: false, message: "File not found" });
  res.download(filePath);
});

// ─── GET /api/receipts/:id — Single Receipt ───────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt)
      return res.status(404).json({ success: false, message: "Receipt not found" });
    res.json({ success: true, data: receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /api/receipts/:id/status — Update Status ──────────────────────────
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, action } = req.body;

    const validStatuses = ["pending", "in_progress", "processed", "rejected", "forwarded"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const receipt = await Receipt.findById(req.params.id);
    if (!receipt)
      return res.status(404).json({ success: false, message: "Receipt not found" });

    receipt.status = status;
    receipt.actionLog.push({
      action: action || `Status changed to ${status}`,
      updatedByName: "DEO",
    });

    await receipt.save();
    res.json({ success: true, data: receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;