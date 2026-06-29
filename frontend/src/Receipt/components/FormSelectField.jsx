const FormSelectField = ({
  label,
  required = false,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  otherValue = "",
  onOtherChange,
  onOtherBlur,
  otherName,
  error,
  otherError,
}) => {
  // ✅ Show textbox when "Other" is selected
  const showOther = value === "Other";

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-900/60">
        {label}{" "}
        {required && (
          <span className="text-red-500 normal-case tracking-normal">*</span>
        )}
      </label>

      {/* Dropdown */}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`h-11 w-full px-4 pr-10 rounded-xl border bg-white text-sm text-gray-800
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
            hover:border-blue-400 transition-all duration-200 appearance-none cursor-pointer
            ${error ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
        >
          <option value="">— Select —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Dropdown Error */}
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}

      {/* ✅ "Other" Textbox — shows only when Other is selected */}
      {showOther && (
        <div className="mt-2">
          <input
            type="text"
            name={otherName || `${name}_other`}
            value={otherValue}
            onChange={onOtherChange}
            onBlur={onOtherBlur}
            placeholder="Please specify form type..."
            className={`h-11 w-full px-4 rounded-xl border text-sm text-gray-800
              placeholder:text-gray-300 focus:outline-none focus:ring-2
              focus:ring-blue-500/30 focus:border-blue-500
              hover:border-blue-400 transition-all duration-200
              ${otherError ? "border-red-400 bg-red-50/30" : "border-blue-300 bg-blue-50/40"}`}
          />
          {otherError && (
            <p className="text-xs text-red-500 mt-0.5">{otherError}</p>
          )}
        </div>
      )}

    </div>
  );
};

export default FormSelectField;