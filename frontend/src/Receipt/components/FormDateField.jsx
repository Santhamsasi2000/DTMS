const FormDateField = ({ label, required = false, value, onChange, name }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-900/60">
        {label} {required && <span className="text-red-500 normal-case tracking-normal">*</span>}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        max={today}
        onChange={onChange}
        required={required}
        className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          hover:border-blue-400 transition-all duration-200 cursor-pointer"
      />
    </div>
  );
};

export default FormDateField;