import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

const RECEIPT_MODE_LABELS = {
  post:    "Post",
  byHand:  "By Hand",
  counter: "Counter",
  courier: "Courier",
};

const ReportsExportPDFButton = ({ receipts }) => {

  const handleExportPDF = () => {
    if (!receipts.length) return;

    const doc = new jsPDF({
      orientation: "landscape",
      unit:        "mm",
      format:      "a4",
    });

    // ─── Header ───────────────────────────────────────────────────────────────
    doc.setFillColor(0, 59, 122); // #003B7A
    doc.rect(0, 0, 297, 20, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("EPFO Regional Office, Chennai", 14, 9);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Tapal Management System — Receipt Report", 14, 15);

    // Date on right
    doc.setFontSize(8);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      283,
      9,
      { align: "right" }
    );
    doc.text(
      `Total Records: ${receipts.length}`,
      283,
      15,
      { align: "right" }
    );

    // ─── Table ────────────────────────────────────────────────────────────────
    const columns = [
      { header: "#",            dataKey: "sno"      },
      { header: "Tapal No.",    dataKey: "taphalNo" },
      { header: "Date",         dataKey: "date"     },
      { header: "Mode",         dataKey: "mode"     },
      { header: "Form Type",    dataKey: "formType" },
      { header: "Member Name",  dataKey: "memberName"},
      { header: "UAN",          dataKey: "uan"      },
      { header: "Member ID",    dataKey: "memberId" },
      { header: "Mobile",       dataKey: "mobile"   },
      { header: "Group",        dataKey: "group"    },
      { header: "Task",         dataKey: "task"     },
      { header: "Subject",      dataKey: "subject"  },
      { header: "Status",       dataKey: "status"   },
    ];

    const rows = receipts.map((r, idx) => ({
      sno:        idx + 1,
      taphalNo:   r.taphalNo   || "—",
      date:       new Date(r.receiptDate).toLocaleDateString("en-IN"),
      mode:       RECEIPT_MODE_LABELS[r.receiptMode] || r.receiptMode || "—",
      formType:   r.formType   || "—",
      memberName: r.memberName || "—",
      uan:        r.uan        || "—",
      memberId:   r.memberId   || "—",
      mobile:     r.mobile     || "—",
      group:      r.group      || "—",
      task:       r.task       || "—",
      subject:    r.subject    || "—",
      status:     r.status
        ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
        : "—",
    }));

    autoTable(doc, {
      columns,
      body: rows,
      startY: 24,
      margin: { left: 14, right: 14 },

      // Head style
      headStyles: {
        fillColor:  [29, 111, 164], // #1D6FA4
        textColor:  [255, 255, 255],
        fontStyle:  "bold",
        fontSize:   7,
        halign:     "left",
        cellPadding: 3,
      },

      // Body style
      bodyStyles: {
        fontSize:    7,
        textColor:   [50, 50, 50],
        cellPadding: 2.5,
      },

      // Alternate row color
      alternateRowStyles: {
        fillColor: [240, 246, 255],
      },

      // Status column color
      didDrawCell: (data) => {
        if (data.column.dataKey === "status" && data.section === "body") {
          const status = data.cell.raw?.toLowerCase();
          if (status === "received") {
            doc.setTextColor(180, 120, 0);
          } else if (status === "completed") {
            doc.setTextColor(5, 150, 105);
          } else if (status === "rejected") {
            doc.setTextColor(220, 38, 38);
          }
        }
      },

      // Column widths
      columnStyles: {
        sno:        { cellWidth: 8  },
        taphalNo:   { cellWidth: 32 },
        date:       { cellWidth: 18 },
        mode:       { cellWidth: 18 },
        formType:   { cellWidth: 30 },
        memberName: { cellWidth: 25 },
        uan:        { cellWidth: 22 },
        memberId:   { cellWidth: 18 },
        mobile:     { cellWidth: 20 },
        group:      { cellWidth: 15 },
        task:       { cellWidth: 18 },
        subject:    { cellWidth: 25 },
        status:     { cellWidth: 16 },
      },

      // Footer row
      foot: [[
        {
          content: `EPFO Regional Office, Chennai · Tapal Management System · Ministry of Labour & Employment`,
          colSpan: columns.length,
          styles: {
            halign:    "center",
            fontSize:  6,
            textColor: [150, 150, 150],
            fillColor: [248, 250, 252],
          },
        },
      ]],
      showFoot: "lastPage",
    });

    // ─── Page Numbers ─────────────────────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        283,
        doc.internal.pageSize.height - 5,
        { align: "right" }
      );
    }

    // ─── Save ─────────────────────────────────────────────────────────────────
    doc.save(`EPFO_Tapals_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <button
      onClick={handleExportPDF}
      disabled={!receipts.length}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
        bg-red-600 text-white text-sm font-semibold
        hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <HiOutlineDocumentArrowDown className="text-base" />
      Export PDF
    </button>
  );
};

export default ReportsExportPDFButton;