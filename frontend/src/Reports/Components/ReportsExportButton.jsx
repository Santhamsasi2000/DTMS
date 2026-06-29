import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

const RECEIPT_MODE_LABELS = {
  post: "Post",
  hand: "Hand Delivery",
  email: "Email / Print",
  courier: "Courier",
};

const ReportsExportButton = ({ receipts }) => {

  const handleExportCSV = () => {
    if (!receipts.length) return;

    const headers = [
      "Tapal No.", "Date", "Mode", "Form Type", "UAN",
      "Member ID", "Member Name", "Mobile", "Establishment",
      "Group", "Task", "Subject", "Status", "Created By",
    ];

    const rows = receipts.map((r) => [
      r.taphalNo,
      new Date(r.receiptDate).toLocaleDateString("en-IN"),
      RECEIPT_MODE_LABELS[r.receiptMode] || r.receiptMode,
      r.formType,
      r.uan,
      r.memberId,
      r.memberName,
      r.mobile,
      r.establishmentName,
      r.group,
      r.task,
      r.subject,
      r.status,
      r.createdByName,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `EPFO_Tapals_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExportCSV}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
        bg-emerald-600 text-white text-sm font-semibold
        hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm"
    >
      <HiOutlineDocumentArrowDown className="text-base" />
      Export CSV
    </button>
  );
};

export default ReportsExportButton;