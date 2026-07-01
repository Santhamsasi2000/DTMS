import { HiOutlineArrowDownTray, HiOutlinePencilSquare } from "react-icons/hi2";
import StatusBadge from "../../components/StatusBadge";
import Pagination  from "../../components/Pagination";

const TABLE_HEADERS = [
  "#", "Date", "Form Type",
  "Member Name", "UAN", "Group", "Task",
  "Status", "Docs", "Action",
];

const AcknowledgementTable = ({
  receipts,
  loading,
  error,
  filters,
  pagination,
  onPageChange,
  onDownload,
  onAction,
}) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
        <svg className="animate-spin w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading tapals...
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
        No tapals found.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead>
            <tr className="bg-blue-50/60 border-b border-gray-100">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-bold
                    uppercase tracking-widest text-blue-400 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {receipts.map((r, idx) => (
              <tr
                key={r._id}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
              >
                {/* # */}
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {(filters.page - 1) * filters.limit + idx + 1}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(r.receiptDate).toLocaleDateString("en-IN")}
                </td>

                {/* Form Type */}
                <td
                  className="px-4 py-3 text-gray-700 max-w-[160px] truncate"
                  title={r.formType}
                >
                  {r.formType}
                </td>

                {/* Member Name */}
                <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                  {r.memberName || <span className="text-gray-300">—</span>}
                </td>

                {/* UAN */}
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
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

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>

                {/* Documents */}
                <td className="px-4 py-3">
                  {r.documents?.length > 0 ? (
                    <div className="flex gap-1">
                      {r.documents.map((doc, i) => (
                        <button
                          key={i}
                          onClick={() => onDownload(doc.url)}
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

                {/* Action Button */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onAction(r)}
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

      {/* Pagination */}
      <div className="px-5 py-4 border-t border-gray-50">
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      </div>
    </>
  );
};

export default AcknowledgementTable;