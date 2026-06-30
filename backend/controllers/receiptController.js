const Receipt   = require("../models/ReceiptModel");
const cloudinary = require("../config/cloudinary");

// ─── CREATE Receipt ───────────────────────────────────────────────────────────
const createReceipt = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // ✅ Map Cloudinary uploaded files
    const documents = (req.files || []).map((file) => ({
      originalName: file.originalname,
      url:          file.path,
      public_id:    file.filename,
      mimeType:     file.mimetype,
      size:         file.size,
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
    });

    res.status(201).json({ success: true, data: receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL Receipts (search + single date + pagination) ─────────────────────
const getAllReceipts = async (req, res) => {
  try {
    const {
      search = "",
      date   = "",   // ✅ Single date filter
      page   = 1,
      limit  = 10,
    } = req.query;

    const query = {};

    // ✅ Search filter
    if (search) {
      query.$or = [
        { taphalNo:          { $regex: search, $options: "i" } },
        { uan:               { $regex: search, $options: "i" } },
        { memberId:          { $regex: search, $options: "i" } },
        { memberName:        { $regex: search, $options: "i" } },
        { establishmentName: { $regex: search, $options: "i" } },
        { group:             { $regex: search, $options: "i" } },
        { subject:           { $regex: search, $options: "i" } },
        { taphalNo:          { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Single date filter — matches full day
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.receiptDate = {
        $gte: start,
        $lte: end,
      };
    }

    const skip     = (Number(page) - 1) * Number(limit);
    const total    = await Receipt.countDocuments(query);
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
};

// ─── GET Single Receipt ───────────────────────────────────────────────────────
const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt)
      return res.status(404).json({ success: false, message: "Receipt not found" });

    res.json({ success: true, data: receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE Status ────────────────────────────────────────────────────────────
const updateReceiptStatus = async (req, res) => {
  try {
    const { status, action } = req.body;

    const validStatuses = [
      "received",
      "completed",
      "rejected",
    ];

    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const receipt = await Receipt.findById(req.params.id);
    if (!receipt)
      return res.status(404).json({ success: false, message: "Receipt not found" });

    receipt.status = status;
    receipt.actionLog.push({
      action:        action || `Status changed to ${status}`,
      updatedByName: "DEO",
    });

    await receipt.save();
    res.json({ success: true, data: receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE Document from Cloudinary ─────────────────────────────────────────
const deleteDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;

    const receipt = await Receipt.findById(id);
    if (!receipt)
      return res
        .status(404)
        .json({ success: false, message: "Receipt not found" });

    const doc = receipt.documents.id(docId);
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });

    // ✅ Delete from Cloudinary
    try {
      const resourceType =
        doc.mimeType === "application/pdf" ? "raw" : "image";

      await cloudinary.uploader.destroy(doc.public_id, {
        resource_type: resourceType,
      });

      console.log(`✅ Deleted from Cloudinary: ${doc.public_id}`);
    } catch (cloudinaryErr) {
      console.error("Cloudinary delete error:", cloudinaryErr.message);
    }

    // ✅ Remove from MongoDB
    doc.deleteOne();
    await receipt.save();

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Receipt (also deletes documents from Cloudinary)
const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    // delete all cloudinary files (if any)
    const docs = receipt.documents || [];
    await Promise.allSettled(
      docs.map((doc) =>
        cloudinary.uploader.destroy(doc.public_id, {
          resource_type: doc.mimeType === "application/pdf" ? "raw" : "image",
        })
      )
    );

    await receipt.deleteOne();

    res.json({ success: true, message: "Receipt deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceiptStatus,
  deleteDocument,
  deleteReceipt,
};