import { useState } from "react";
import { useReceipts } from "../hooks/useReceipts";
import TableSearch from "../components/TableSearch";
import AcknowledgementTable       from "./Components/AcknowledgementTable";
import AcknowledgementActionModal from "./Components/AcknowledgementActionModal";

const Acknowledgement = () => {
  const {
    receipts,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    updateStatus,
  } = useReceipts();

  const [actionModal, setActionModal] = useState(null);

  const handlePageChange = (page) =>
    setFilters((prev) => ({ ...prev, page }));

  // ✅ Open Cloudinary URL directly
  const handleDownload = (url) => {
    window.open(url, "_blank");
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
      <div>

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

        {/* Search */}
        <TableSearch
          filters={filters}
          setFilters={setFilters}
          totalCount={pagination.total}
        />

        {/* Table Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />

          <AcknowledgementTable
            receipts={receipts}
            loading={loading}
            error={error}
            filters={filters}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDownload={handleDownload}
            onAction={openActionModal}
          />
        </div>

      </div>

      {/* Action Modal */}
      <AcknowledgementActionModal
        actionModal={actionModal}
        setActionModal={setActionModal}
        onUpdate={handleStatusUpdate}
      />

    </div>
  );
};

export default Acknowledgement;