import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark } from "react-icons/hi2";

const TableSearch = ({ filters, setFilters, totalCount }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleClear = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      date: "",
      page: 1,
    }));
  };

  const hasFilters = filters.search || filters.date;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3">

        {/* Search Input */}
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

        {/* Single Date Filter */}
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            hover:border-blue-300 transition-all cursor-pointer"
        />

        {/* Clear Button */}
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

        {/* Total Count Badge */}
        <div className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-blue-50 border border-blue-100">
          <HiOutlineFunnel className="text-blue-500 text-base" />
          <span className="text-sm font-semibold text-blue-700">{totalCount}</span>
          <span className="text-xs text-blue-400">records</span>
        </div>

      </div>
    </div>
  );
};

export default TableSearch;