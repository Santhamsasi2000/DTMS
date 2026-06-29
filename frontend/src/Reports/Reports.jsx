import { useReceipts }         from "../hooks/useReceipts";
import TableSearch             from "../components/TableSearch";
import ReportsExportButton     from "./components/ReportsExportButton";
import ReportsSummaryCards     from "./components/ReportsSummaryCards";
import ReportsTable            from "./components/ReportsTable";

const Reports = () => {
  const {
    receipts,
    pagination,
    loading,
    error,
    filters,
    setFilters,
  } = useReceipts();

  const handlePageChange = (page) =>
    setFilters((prev) => ({ ...prev, page }));

  return (
    <div className="min-h-screen p-6 md:p-8 ">  
      <div className="">

        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl text-blue-800 font-bold font-sora tracking-tight">
                Reports
              </h1>
            </div>
            <p className="text-gray-600">
              View and export all tapal records with filters
            </p>
          </div>

          {/* Export Button */}
          <ReportsExportButton receipts={receipts} />
        </div>

        {/* Summary Cards */}
        <ReportsSummaryCards
          receipts={receipts}
          filters={filters}
          setFilters={setFilters}
        />

        {/* Search */}
        <TableSearch
          filters={filters}
          setFilters={setFilters}
          totalCount={pagination.total}
        />

        {/* Table Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />

          <ReportsTable
            receipts={receipts}
            loading={loading}
            error={error}
            filters={filters}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
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