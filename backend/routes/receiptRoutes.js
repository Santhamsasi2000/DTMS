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
  deleteReceipt
} = require("../controllers/receiptController");


router.get("/", auth, authorizeRoles("RECEIPT", "ACKNOWLEDGE", "REPORTS"), getAllReceipts);
router.get("/:id", auth, authorizeRoles("RECEIPT", "ACKNOWLEDGE", "REPORTS" ), getReceiptById);

router.post("/", auth, authorizeRoles("RECEIPT"), upload.array("documents", 10), createReceipt );

router.patch(
  "/:id/status",
  auth,
  authorizeRoles("ACKNOWLEDGE"),
  updateReceiptStatus
);

router.delete(
  "/:id/documents/:docId",
  auth,
  authorizeRoles("ACKNOWLEDGE"),
  deleteDocument
);

// ✅ Only RECEIPT role can delete (recommended)
router.delete(
  "/:id",
  auth,
  authorizeRoles("RECEIPT"),
  deleteReceipt
);

module.exports = router;