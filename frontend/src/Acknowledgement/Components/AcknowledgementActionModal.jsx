import { HiOutlineCheckCircle } from "react-icons/hi2";

const STATUS_OPTIONS = [
  { value: "received",  label: "Received"  },
  { value: "completed", label: "Completed" },
  { value: "rejected",  label: "Rejected"  },
];

const AcknowledgementActionModal = ({ actionModal, setActionModal, onUpdate }) => {
  if (!actionModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center
      justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header Strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />

        <div className="p-6">

          {/* Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <HiOutlineCheckCircle className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 font-sora">
                Update Status
              </h3>
              <p className="text-xs text-gray-400">
                Add action remarks and set new status
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">

            {/* Status Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-blue-400">
                New Status
              </label>
              <select
                value={actionModal.status}
                onChange={(e) =>
                  setActionModal((prev) => ({ ...prev, status: e.target.value }))
                }
                className="h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                  appearance-none bg-white transition-all"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Remarks */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Action Remarks
              </label>
              <textarea
                value={actionModal.action}
                onChange={(e) =>
                  setActionModal((prev) => ({ ...prev, action: e.target.value }))
                }
                placeholder="Describe the action taken..."
                rows={3}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                  placeholder:text-gray-300 focus:outline-none focus:ring-2
                  focus:ring-blue-500/30 focus:border-blue-500 resize-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onUpdate}
              className="flex-1 h-11 rounded-xl bg-[#003B7A] text-white text-sm font-semibold
                hover:bg-[#004A9A] active:scale-[0.98] transition-all"
            >
              Update Status
            </button>
            <button
              onClick={() => setActionModal(null)}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600
                text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AcknowledgementActionModal;