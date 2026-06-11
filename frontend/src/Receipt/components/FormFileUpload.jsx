import { useRef } from "react";
import { HiOutlineArrowUpTray, HiOutlineXCircle, HiOutlineDocument } from "react-icons/hi2";

const FormFileUpload = ({ files, onChange, onRemove }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    onChange(selected);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    onChange(dropped);
  };

  const handleDragOver = (e) => e.preventDefault();

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-900/60">
        Documents{" "}
        <span className="normal-case tracking-normal font-normal text-gray-400">
          (PDF, JPG, PNG · max 10 files)
        </span>
      </label>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-blue-200 rounded-2xl px-6 py-8
          flex flex-col items-center gap-3 cursor-pointer group
          hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 bg-white"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center
          group-hover:bg-blue-100 transition-all duration-200">
          <HiOutlineArrowUpTray className="text-blue-500 text-2xl group-hover:scale-110 transition-transform duration-200" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-700">
            Click to upload{" "}
            <span className="font-normal text-gray-400">or drag & drop</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG supported</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="flex flex-col gap-2 mt-1">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 bg-blue-50 border border-blue-100
                rounded-xl px-4 py-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <HiOutlineDocument className="text-blue-600 text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-gray-300 hover:text-red-500 transition-colors duration-200 shrink-0"
              >
                <HiOutlineXCircle className="text-xl" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Count badge */}
      {files.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {files.length} / 10 files selected
        </p>
      )}
    </div>
  );
};

export default FormFileUpload;