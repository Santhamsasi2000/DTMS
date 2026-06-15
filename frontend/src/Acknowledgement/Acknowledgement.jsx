import { useState } from "react";
import { HiOutlineArrowDownTray, HiOutlinePencilSquare, HiOutlineCheckCircle } from "react-icons/hi2";
import { useReceipts } from "../hooks/useReceipts";
import TableSearch from "../components/TableSearch";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import API_BASE_URL from "../../config";

const STATUS_OPTIONS = [
  { value: "pending",     label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "processed",   label: "Processed" },
  { value: "rejected",    label: "Rejected" },
  { value: "forwarded",   label: "Forwarded" },
];

const API = API_BASE_URL;

const Acknowledgement = () => {
  const { receipts, pagination, loading, error, filters, setFilters, updateStatus } = useReceipts();
  const [actionModal, setActionModal] = useState(null); // { id, status, action }

  const handlePageChange = (page) => setFilters((p) => ({ ...p, page }));

  const handleDownload = (filename) => 
  {
    window.open(`${API}/api/receipts/file/${filename}`, "_blank");
  };

  const openActionModal = (receipt) => {
    setActionModal({ id: receipt._id, status: receipt.status, action: "" });
  };

  const handleStatusUpdate = async () => {
    if (!actionModal) return;
    await updateStatus(actionModal.id, actionModal.status, actionModal.action);
    setActionModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-[#003B7A]" />
            <h1 className="text-2xl font-bold text-[#003B7A] font-sora tracking-tight">
              Acknowledgement
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">
            Review, action and update status of received tapals
          </p>
        </div>

        {/* Search & Filters */}
        <TableSearch
          filters={filters}
          setFilters={setFilters}
          totalCount={pagination.total}
        />

        {/* Table Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Header strip */}
          <div className="h-1 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
              <svg className="animate-spin w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Loading tapals...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No tapals found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50/60 border-b border-gray-100">
                    {["#", "Tapal No.", "Date", "Form Type", "Member Name", "UAN", "Group", "Task", "Status", "Docs", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-blue-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r, idx) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
                    >
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
                      <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate" title={r.formType}>
                        {r.formType}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                        {r.memberName || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {r.uan || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.group}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">
                        {r.task || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        {r.documents?.length > 0 ? (
                          <div className="flex gap-1">
                            {r.documents.map((doc, i) => (
                              <button
                                key={i}
                                onClick={() => handleDownload(doc.fileName)}
                                title={doc.originalName}
                                className="w-7 h-7 flex items-center justify-center rounded-lg
                                  bg-sky-50 border border-sky-200 text-sky-600
                                  hover:bg-sky-100 transition-all"
                              >
                                <HiOutlineArrowDownTray className="text-sm" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">No files</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openActionModal(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                            bg-[#003B7A] text-white text-xs font-semibold
                            hover:bg-[#004A9A] transition-all active:scale-95"
                        >
                          <HiOutlinePencilSquare className="text-sm" />
                          Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && receipts.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-50">
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <HiOutlineCheckCircle className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 font-sora">Update Status</h3>
                  <p className="text-xs text-gray-400">Add action remarks and set new status</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    New Status
                  </label>
                  <select
                    value={actionModal.status}
                    onChange={(e) => setActionModal((p) => ({ ...p, status: e.target.value }))}
                    className="h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                      appearance-none bg-white transition-all"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Action Remarks
                  </label>
                  <textarea
                    value={actionModal.action}
                    onChange={(e) => setActionModal((p) => ({ ...p, action: e.target.value }))}
                    placeholder="Describe the action taken..."
                    rows={3}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                      placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30
                      focus:border-blue-500 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 h-11 rounded-xl bg-[#003B7A] text-white text-sm font-semibold
                    hover:bg-[#004A9A] active:scale-[0.98] transition-all"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setActionModal(null)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm
                    font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Acknowledgement;