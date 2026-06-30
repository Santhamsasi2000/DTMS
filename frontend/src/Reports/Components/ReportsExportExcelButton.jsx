import * as XLSX from "xlsx";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

const RECEIPT_MODE_LABELS = {
  post: "Post",
  byHand: "By Hand",
  counter: "Counter",
  courier: "Courier",
};

const ReportsExportExcelButton = ({ receipts }) => {
  const handleExportExcel = () => {
    if (!receipts?.length) return;

    const rows = receipts.map((r, idx) => ({
      "S.No": idx + 1,
      "Tapal No.": r.taphalNo || "",
      "Date": r.receiptDate ? new Date(r.receiptDate).toLocaleDateString("en-IN") : "",
      "Mode": RECEIPT_MODE_LABELS[r.receiptMode] || r.receiptMode || "",
      "Form Type": r.formType || "",
      "UAN": r.uan || "",
      "Member ID": r.memberId || "",
      "Member Name": r.memberName || "",
      "Mobile": r.mobile || "",
      "Establishment": r.establishmentName || "",
      "Group": r.group || "",
      "Task": r.task || "",
      "Subject": r.subject || "",
      "Status": r.status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");

    XLSX.writeFile(wb, `EPFO_Tapals_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExportExcel}
      disabled={!receipts?.length}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
        bg-sky-700 text-white text-lg font-semibold
        hover:bg-sky-800 active:scale-[0.98] transition-all shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <HiOutlineDocumentArrowDown className="text-xl" />
      Export Excel
    </button>
  );
};

export default ReportsExportExcelButton;