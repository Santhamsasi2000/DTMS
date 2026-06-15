import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1 mt-4">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{from}–{to}</span> of{" "}
        <span className="font-semibold text-gray-600">{total}</span> records
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
            text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600
            disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <HiOutlineChevronLeft className="text-base" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${item === page
                    ? "bg-[#003B7A] text-white border border-[#003B7A]"
                    : "border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {item}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
            text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600
            disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <HiOutlineChevronRight className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;