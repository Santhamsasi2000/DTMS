import { useReceipts } from "../hooks/useReceipts";
import TableSearch from "../components/TableSearch";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import API_BASE_URL from "../../config";

const RECEIPT_MODE_LABELS = {
  post: "Post", hand: "Hand Delivery", email: "Email / Print", courier: "Courier",
};

const API = API_BASE_URL

const Reports = () => {
  const { receipts, pagination, loading, error, filters, setFilters } = useReceipts();

  const handlePageChange = (page) => setFilters((p) => ({ ...p, page }));

  // Summary stats from current page
  const statusCounts = receipts.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const handleExportCSV = () => {
    if (!receipts.length) return;
    const headers = ["Tapal No.", "Date", "Mode", "Form Type", "UAN", "Member ID",
      "Member Name", "Mobile", "Establishment", "Group", "Task", "Subject", "Status", "Created By"];
    const rows = receipts.map((r) => [
      r.taphalNo,
      new Date(r.receiptDate).toLocaleDateString("en-IN"),
      RECEIPT_MODE_LABELS[r.receiptMode] || r.receiptMode,
      r.formType, r.uan, r.memberId, r.memberName,
      r.mobile, r.establishmentName, r.group,
      r.task, r.subject, r.status, r.createdByName,
    ]);
    const csv = [headers, ...rows].map((row) =>
      row.map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EPFO_Tapals_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 rounded-full bg-[#003B7A]" />
              <h1 className="text-2xl font-bold text-[#003B7A] font-sora tracking-tight">
                Reports
              </h1>
            </div>
            <p className="text-sm text-gray-400 ml-4">
              View and export all tapal records with filters
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-emerald-600 text-white text-sm font-semibold
              hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm"
          >
            <HiOutlineDocumentArrowDown className="text-base" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          {[
            { key: "pending",     label: "Pending",     color: "bg-amber-50 border-amber-200 text-amber-700" },
            { key: "in_progress", label: "In Progress", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { key: "processed",   label: "Processed",   color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
            { key: "rejected",    label: "Rejected",    color: "bg-red-50 border-red-200 text-red-600" },
            { key: "forwarded",   label: "Forwarded",   color: "bg-purple-50 border-purple-200 text-purple-700" },
          ].map(({ key, label, color }) => (
            <div
              key={key}
              onClick={() => setFilters((p) => ({ ...p, status: p.status === key ? "" : key, page: 1 }))}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${color}
                ${filters.status === key ? "ring-2 ring-offset-1 ring-current" : ""}`}
            >
              <p className="text-2xl font-bold">{statusCounts[key] || 0}</p>
              <p className="text-xs font-semibold mt-0.5 opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <TableSearch
          filters={filters}
          setFilters={setFilters}
          totalCount={pagination.total}
        />

        {/* Table Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
              <svg className="animate-spin w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Loading reports...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No records found for selected filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50/60 border-b border-gray-100">
                    {["#", "Tapal No.", "Date", "Mode", "Form Type", "Member Name",
                      "UAN", "Group", "Task", "Establishment", "Status", "Created By"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-blue-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r, idx) => (
                    <tr key={r._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {(filters.page - 1) * filters.limit + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                          {r.taphalNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(r.receiptDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {RECEIPT_MODE_LABELS[r.receiptMode] || r.receiptMode}
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate" title={r.formType}>
                        {r.formType}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                        {r.memberName || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {r.uan || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.group}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">
                        {r.task || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">
                        {r.establishmentName || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {r.createdByName || <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && receipts.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-50">
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          EPFO Regional Office, Chennai · Tapal Management System · Ministry of Labour & Employment
        </p>
      </div>
    </div>
  );
};

export default Reports;