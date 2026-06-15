import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark } from "react-icons/hi2";
import { FORM_TYPE_OPTIONS } from "../Receipt/receiptConstants";

const STATUS_OPTIONS = [
  { value: "pending",     label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "processed",   label: "Processed" },
  { value: "rejected",    label: "Rejected" },
  { value: "forwarded",   label: "Forwarded" },
];

const TableSearch = ({ filters, setFilters, totalCount }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleClear = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      status: "",
      group: "",
      formType: "",
      startDate: "",
      endDate: "",
      page: 1,
    }));
  };

  const hasFilters =
    filters.search || filters.status || filters.group ||
    filters.formType || filters.startDate || filters.endDate;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm space-y-3">

      {/* Top row — search + count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by Tapal No., UAN, Member Name, Group..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm
              text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2
              focus:ring-blue-500/30 focus:border-blue-500 hover:border-blue-300 transition-all"
          />
        </div>

        {hasFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 h-10 rounded-xl border border-red-200
              text-red-500 text-sm hover:bg-red-50 transition-all"
          >
            <HiOutlineXMark className="text-base" />
            Clear
          </button>
        )}

        <div className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-blue-50 border border-blue-100">
          <HiOutlineFunnel className="text-blue-500 text-base" />
          <span className="text-sm font-semibold text-blue-700">{totalCount}</span>
          <span className="text-xs text-blue-400">records</span>
        </div>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            hover:border-blue-300 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          name="formType"
          value={filters.formType}
          onChange={handleChange}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            hover:border-blue-300 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Forms</option>
          {FORM_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <input
          type="text"
          name="group"
          value={filters.group}
          onChange={handleChange}
          placeholder="Filter by Group"
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30
            focus:border-blue-500 hover:border-blue-300 transition-all"
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            hover:border-blue-300 transition-all"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            hover:border-blue-300 transition-all"
        />
      </div>
    </div>
  );
};

export default TableSearch;