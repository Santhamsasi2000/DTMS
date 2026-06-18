const express  = require("express");
const router   = express.Router();
const upload   = require("../config/multer");  // ✅ Cloudinary multer

const {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceiptStatus,
  deleteDocument,
} = require("../controllers/receiptController");

// ─── Routes ───────────────────────────────────────────────────────────────────

// Create Receipt — multer uploads to Cloudinary automatically
router.post(   "/",                        upload.array("documents", 10), createReceipt      );
router.get(    "/",                                                        getAllReceipts      );
router.get(    "/:id",                                                     getReceiptById     );
router.patch(  "/:id/status",                                              updateReceiptStatus);

// ✅ Delete single document from Cloudinary + MongoDB
router.delete( "/:id/documents/:docId",                                    deleteDocument     );

module.exports = router;