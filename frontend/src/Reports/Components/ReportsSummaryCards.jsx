const SUMMARY_CARDS = [
  { key: "received1",     label: "Received1",     color: "bg-amber-50 border-amber-200 text-amber-700"},
  { key: "completed", label: "Completed", color: "bg-blue-50 border-blue-200 text-blue-700"},
  { key: "rejected",    label: "Rejected",    color: "bg-red-50 border-red-200 text-red-600"},
];

const ReportsSummaryCards = ({ receipts, filters, setFilters }) => {

  // Count status from current page receipts
  const statusCounts = receipts.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const handleCardClick = (key) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === key ? "" : key,
      page: 1,
    }));
  };

  return (
    <div className="grid grid-cols-3 gap-8 mb-5">
      {SUMMARY_CARDS.map(({ key, label, color }) => (
        <div
          key={key}
          onClick={() => handleCardClick(key)}
          className={`border rounded-2xl p-4 cursor-pointer transition-all
            hover:scale-[1.02] ${color}
            ${filters.status === key ? "ring-2 ring-offset-1 ring-current" : ""}`}
        >
          <p className="text-2xl font-bold">
            {statusCounts[key] || 0}
          </p>
          <p className="text-xs font-semibold mt-0.5 opacity-80">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportsSummaryCards;