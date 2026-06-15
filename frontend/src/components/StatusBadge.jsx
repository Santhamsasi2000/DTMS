const STATUS_STYLES = {
  pending:     "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  processed:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected:    "bg-red-50 text-red-600 border-red-200",
  forwarded:   "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_LABELS = {
  pending:     "Pending",
  in_progress: "In Progress",
  processed:   "Processed",
  rejected:    "Rejected",
  forwarded:   "Forwarded",
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || "bg-gray-50 text-gray-600 border-gray-200";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {label}
    </span>
  );
};

export default StatusBadge;