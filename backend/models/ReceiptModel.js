const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    taphalNo: {
      type: String,
      unique: true,
    },
    receiptDate: {
      type: Date,
      required: true,
    },
    receiptMode: {
      type: String,
      required: true,
      enum: ["post", "hand", "email", "courier"],
    },
    formType: {
      type: String,
      required: false,
      trim: true,
    },
    uan:               { type: String, trim: true },
    memberId:          { type: String, trim: true },
    memberName:        { type: String, trim: true },
    mobile:            { type: String, trim: true },
    establishmentName: { type: String, trim: true },
    group:             { type: String, required: true, trim: true },
    task:              { type: String, trim: true },
    subject:           { type: String, trim: true },

    // ✅ Updated for Cloudinary
    documents: [
      {
        originalName: String,   // Original file name
        url:          String,   // Cloudinary URL
        public_id:    String,   // Cloudinary public_id (for delete)
        mimeType:     String,
        size:         Number,
      },
    ],

    status: {
      type: String,
      enum: ["received", "completed", "rejected"],
      default: "received",
    },
    actionLog: [
      {
        action:        String,
        updatedByName: String,
        timestamp:     { type: Date, default: Date.now },
      },
    ],
    createdByName: String,
  },
  { timestamps: true }
);

// ─── Auto-generate Taphal Number before save ──────────────────────────────────
receiptSchema.pre("save", async function () {
  if (!this.taphalNo) {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day   = String(now.getDate()).padStart(2, "0");
    const count = await mongoose.model("Receipt").countDocuments();
    const seq   = String(count + 1).padStart(4, "0");
    this.taphalNo = `TPCH-${year}${month}${day}-${seq}`;
  }
});

module.exports = mongoose.model("Receipt", receiptSchema);