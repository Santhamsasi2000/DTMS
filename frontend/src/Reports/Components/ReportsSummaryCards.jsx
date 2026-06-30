const SUMMARY_CARDS = [
  { key: "received",     label: "Received",     color: "bg-yellow-50 border-yellow-300 text-yellow-700"},
  { key: "completed", label: "Completed", color: "bg-blue-50 border-blue-300 text-blue-700"},
  { key: "rejected",    label: "Rejected",    color: "bg-red-50 border-red-300 text-red-700"},
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
    <div className="grid grid-cols-3 gap-10 mb-8">
      {SUMMARY_CARDS.map(({ key, label, color }) => (
        <div
          key={key}
          onClick={() => handleCardClick(key)}
          className={`border rounded-2xl p-4 cursor-pointer transition-all
            hover:scale-[1.02] ${color}
            ${filters.status === key ? "ring-2 ring-offset-1 ring-current" : ""}`}
        >
          <p className="text-3xl font-bold">
            {statusCounts[key] || 0}
          </p>
          <p className="font-semibold mt-0.5">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportsSummaryCards;