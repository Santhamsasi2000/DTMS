import { useState } from "react";
import FormDateField from "./components/FormDateField";
import FormSelectField from "./components/FormSelectField";
import FormTextField from "./components/FormTextField";
import FormFileUpload from "./components/FormFileUpload";
import ReceiptFormActions from "./components/ReceiptFormActions";
import { RECEIPT_MODE_OPTIONS, FORM_TYPE_OPTIONS } from "./receiptConstants";

const initialForm = {
  receiptDate: new Date().toISOString().split("T")[0],
  receiptMode: "",
  formType: "",
  formTypeOther: "",
  uan: "",
  memberId: "",
  memberName: "",
  mobile: "",
  establishmentName: "",
  group: "",
  task: "",
  subject: "",
};

const Receipt = () => {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset other text when switching away from "other"
      ...(name === "formType" && value !== "other" ? { formTypeOther: "" } : {}),
    }));
  };

  const handleFilesAdd = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 10));
  };

  const handleFileRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setFiles([]);
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    try {
      const payload = {
        ...form,
        formType: form.formType === "other" ? form.formTypeOther : form.formType,
      };
      // TODO: connect to backend API
      console.log("Submitting:", payload, files);
      await new Promise((r) => setTimeout(r, 1200));
      const taphalNo = `TPCH-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      setSuccessMsg(`Receipt saved! Tapal No: ${taphalNo}`);
      handleCancel();
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-[#003B7A]" />
            <h1 className="text-2xl font-bold text-[#003B7A] font-sora tracking-tight">
              Receipt Entry
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">
            Register a new incoming tapal · Unique receipt number assigned automatically
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-5 flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-200
            rounded-2xl text-sm font-medium text-emerald-700">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5.5 9L7.5 11L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {successMsg}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl
            shadow-xl shadow-blue-900/5 overflow-hidden"
        >
          {/* Card Header Strip */}
          <div className="h-1.5 bg-gradient-to-r from-[#003B7A] via-[#1D6FA4] to-sky-400" />

          <div className="p-6 md:p-8 space-y-6">

            {/* Section 1 — Receipt Info */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-4">
                Receipt Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormDateField
                  label="Receipt Date"
                  name="receiptDate"
                  value={form.receiptDate}
                  onChange={handleChange}
                  required
                />
                <FormSelectField
                  label="Receipt Mode"
                  name="receiptMode"
                  value={form.receiptMode}
                  onChange={handleChange}
                  options={RECEIPT_MODE_OPTIONS}
                  required
                />
                <FormSelectField
                  label="Form Type"
                  name="formType"
                  value={form.formType}
                  onChange={handleChange}
                  options={FORM_TYPE_OPTIONS}
                  otherValue={form.formTypeOther}
                  onOtherChange={handleChange}
                  otherName="formTypeOther"
                />
              </div>
            </div>

            <div className="border-t border-dashed border-gray-100" />

            {/* Section 2 — Member Details */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-4">
                Member Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormTextField
                  label="UAN Number"
                  name="uan"
                  value={form.uan}
                  onChange={handleChange}
                  placeholder="12-digit UAN"
                  maxLength={12}
                />
                <FormTextField
                  label="Member ID"
                  name="memberId"
                  value={form.memberId}
                  onChange={handleChange}
                  placeholder="Member ID"
                />
                <FormTextField
                  label="Member Name"
                  name="memberName"
                  value={form.memberName}
                  onChange={handleChange}
                  placeholder="Full name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  label="Mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                />
                <FormTextField
                  label="Establishment Name"
                  name="establishmentName"
                  value={form.establishmentName}
                  onChange={handleChange}
                  placeholder="Company / Establishment"
                />
              </div>
            </div>

            <div className="border-t border-dashed border-gray-100" />

            {/* Section 3 — Assignment */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-4">
                Assignment
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  label="Group"
                  name="group"
                  value={form.group}
                  onChange={handleChange}
                  placeholder="e.g. Group A"
                  required
                />
                <FormTextField
                  label="Task"
                  name="task"
                  value={form.task}
                  onChange={handleChange}
                  placeholder="e.g. Data Entry"
                />
              </div>
            </div>

            <div className="border-t border-dashed border-gray-100" />

            {/* Section 4 — Subject & Documents */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-4">
                Subject & Documents
              </p>
              <div className="mb-4">
                <FormTextField
                  label="Subject (Optional)"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Brief subject of the tapal"
                />
              </div>
              <FormFileUpload
                files={files}
                onChange={handleFilesAdd}
                onRemove={handleFileRemove}
              />
            </div>

            {/* Actions */}
            <ReceiptFormActions onCancel={handleCancel} isSubmitting={isSubmitting} />
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          EPFO Regional Office, Chennai · Tapal Management System · Ministry of Labour & Employment
        </p>
      </div>
    </div>
  );
};

export default Receipt;