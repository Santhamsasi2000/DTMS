const ReceiptFormActions = ({ onCancel, isSubmitting }) => {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl
          bg-[#003B7A] text-white text-sm font-semibold tracking-wide
          hover:bg-[#004A9A] active:scale-[0.98] transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-900/20"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Save & Submit
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm
          font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700
          active:scale-[0.98] transition-all duration-200"
      >
        Cancel
      </button>
    </div>
  );
};

export default ReceiptFormActions;