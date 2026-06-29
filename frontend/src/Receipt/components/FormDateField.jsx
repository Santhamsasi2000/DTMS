const FormDateField = ({
  label,
  required = false,
  value,
  onChange,
  onBlur,
  name,
  error,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold uppercase tracking-widest text-blue-900/60 mb-2">
        {label}{" "}
        {required && (
          <span className="text-red-500 normal-case tracking-normal">*</span>
        )}
      </label>
      
      <input
        type="date"
        name={name}
        value={value}
        max={today}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`h-11 px-4 rounded-xl border bg-white text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          hover:border-blue-400 transition-all duration-200 cursor-pointer
          ${error ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default FormDateField;