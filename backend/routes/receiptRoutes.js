const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceiptStatus,
  deleteDocument,
} = require("../controllers/receiptController");

// ✅ Both can view list + single + reports usage
router.get("/", auth, authorizeRoles("DEO", "STAFF"), getAllReceipts);
router.get("/:id", auth, authorizeRoles("DEO", "STAFF"), getReceiptById);

// ✅ Only DEO can create receipt
router.post(
  "/",
  auth,
  authorizeRoles("DEO"),
  upload.array("documents", 10),
  createReceipt
);

// ✅ Only STAFF can update status (Acknowledgement)
router.patch(
  "/:id/status",
  auth,
  authorizeRoles("STAFF"),
  updateReceiptStatus
);

// ✅ Optional: only STAFF can delete documents
router.delete(
  "/:id/documents/:docId",
  auth,
  authorizeRoles("STAFF"),
  deleteDocument
);

module.exports = router;