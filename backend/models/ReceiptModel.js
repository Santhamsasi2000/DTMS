const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receiptDate: {
      type: Date,
      required: true,
    },
    receiptMode: {
      type: String,
      required: true,
      enum: ["post", "byHand", "counter", "courier"],
    },
    trackingNo: { type: String, trim: true },
    formType: {
      type: String,
      required: false,
      trim: true,
    },
    uan:               { type: String, trim: true },
    memberOrEstablishmentId:          { type: String, trim: true },
    memberName:        { type: String, trim: true },
    mobile:            { type: String, trim: true },
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

module.exports = mongoose.model("Receipt", receiptSchema);