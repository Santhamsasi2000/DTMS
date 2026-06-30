import StatusBadge from "../../components/StatusBadge";
import Pagination  from "../../components/Pagination";
import { HiOutlineTrash } from "react-icons/hi2";
import { useAuth } from "../../auth/AuthContext";

const RECEIPT_MODE_LABELS = {
  post:    "Post",
  hand:    "Hand Delivery",
  email:   "Email / Print",
  courier: "Courier",
};

const TABLE_HEADERS = [
  "#", "Tapal No.", "Date", "Mode", "Form Type",
  "Member Name", "UAN", "Group", "Task", "Establishment", "Status", "Delete",
];

const ReportsTable = ({
  receipts,
  loading,
  error,
  filters,
  pagination,
  onPageChange,
  onDelete
}) => {

  const { user } = useAuth();
  const canDelete = user?.role === "RECEIPT";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
        <svg className="animate-spin w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No records found for selected filters.
      </div>
    );
  }

  

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50/60 border-b border-gray-100">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-bold
                    uppercase tracking-widest text-blue-400 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {receipts.map((r, idx) => (
              <tr
                key={r._id}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
              >
                {/* # */}
                <td className="px-4 py-3 text-gray-400">
                  {(filters.page - 1) * filters.limit + idx + 1}
                </td>

                {/* Tapal No */}
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold text-blue-700
                    bg-blue-50 px-2 py-0.5 rounded-lg">
                    {r.taphalNo}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(r.receiptDate).toLocaleDateString("en-IN")}
                </td>

                {/* Mode */}
                <td className="px-4 py-3 text-gray-500">
                  {RECEIPT_MODE_LABELS[r.receiptMode] || r.receiptMode}
                </td>

                {/* Form Type */}
                <td
                  className="px-4 py-3 text-gray-700 max-w-[160px] truncate"
                  title={r.formType}
                >
                  {r.formType}
                </td>

                {/* Member Name */}
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {r.memberName || <span className="text-gray-300">—</span>}
                </td>

                {/* UAN */}
                <td className="px-4 py-3 font-mono text-gray-500">
                  {r.uan || <span className="text-gray-300">—</span>}
                </td>

                {/* Group */}
                <td className="px-4 py-3 text-gray-600">
                  {r.group}
                </td>

                {/* Task */}
                <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">
                  {r.task || <span className="text-gray-300">—</span>}
                </td>

                {/* Establishment */}
                <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">
                  {r.establishmentName || <span className="text-gray-300">—</span>}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td> 
                
                {/* ✅ Delete */}
                <td className="px-4 py-3">
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => {
                        const ok = window.confirm(`Delete ${r.taphalNo}?`);
                        if (ok) onDelete(r._id);
                      }}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg
                        border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition"
                      title="Delete receipt"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-4 border-t border-gray-50">
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      </div>
    </>
  );
};

export default ReportsTable;