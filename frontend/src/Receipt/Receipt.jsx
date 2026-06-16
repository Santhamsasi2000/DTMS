import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { useFormik } from "formik";
import { receiptValidationSchema } from "./receiptValidation";
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
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFilesAdd = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 10));
    // Clear file error when file is added
    setFileError("");
  };

  const handleFileRemove = (idx) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      // Show error again if all files removed
      if (updated.length === 0) {
        setFileError("At least 1 document must be uploaded");
      }
      return updated;
    });
  };

  const handleCancel = () => {
    formik.resetForm();
    setFiles([]);
    setSuccessMsg("");
    setErrorMsg("");
    setFileError("");
  };

  const formik = useFormik({
    initialValues: initialForm,
    validationSchema: receiptValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      // Block submit if no file uploaded
      if (files.length === 0) {
        setFileError("At least 1 document must be uploaded");
        return;
      }

      setIsSubmitting(true);
      setSuccessMsg("");
      setErrorMsg("");

      try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (key === "formType" && value === "other") {
            formData.append("formType", values.formTypeOther);
          } else if (key !== "formTypeOther") {
            formData.append(key, value);
          }
        });

        files.forEach((file) => formData.append("documents", file));

        const { data } = await axios.post(
          `${API_BASE_URL}/api/receipts`,
          formData
        );

        setSuccessMsg(
          `Receipt saved successfully! Tapal No : ${data.data.taphalNo}`
        );
        resetForm();
        setFiles([]);
        setFileError("");
      } catch (error) {
        setErrorMsg(
          error.response?.data?.message || "Failed to save receipt."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <section className="p-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 rounded-full bg-sky-800" />
            <h1 className="text-3xl font-bold text-blue-800 font-sora tracking-tight">
              Receipt Entry
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-4">
            Register a new incoming tapal · Unique receipt number assigned
            automatically
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div
            className="mb-5 flex items-center gap-3 px-5 py-3.5 bg-emerald-50
            border border-emerald-200 rounded-2xl text-sm font-medium text-emerald-700"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle
                cx="9"
                cy="9"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5.5 9L7.5 11L12.5 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {successMsg}
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div
            className="mb-5 flex items-center gap-3 px-5 py-3.5 bg-red-50
            border border-red-200 rounded-2xl text-sm font-medium text-red-600"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle
                cx="9"
                cy="9"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M9 5v4M9 12v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {errorMsg}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl
            shadow-xl overflow-hidden"
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
                  value={formik.values.receiptDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.receiptDate && formik.errors.receiptDate
                  }
                  required
                />
                <FormSelectField
                  label="Receipt Mode"
                  name="receiptMode"
                  value={formik.values.receiptMode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={RECEIPT_MODE_OPTIONS}
                  error={
                    formik.touched.receiptMode && formik.errors.receiptMode
                  }
                  required
                />
                <FormSelectField
                  label="Form Type"
                  name="formType"
                  value={formik.values.formType}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value !== "other") {
                      formik.setFieldValue("formTypeOther", "");
                    }
                  }}
                  onBlur={formik.handleBlur}
                  options={FORM_TYPE_OPTIONS}
                  error={formik.touched.formType && formik.errors.formType}
                  otherValue={formik.values.formTypeOther}
                  otherName="formTypeOther"
                  onOtherChange={formik.handleChange}
                  onOtherBlur={formik.handleBlur}
                  otherError={
                    formik.touched.formTypeOther && formik.errors.formTypeOther
                  }
                  required
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
                  value={formik.values.uan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="12-digit UAN"
                  maxLength={12}
                  error={formik.touched.uan && formik.errors.uan}
                />
                <FormTextField
                  label="Member ID"
                  name="memberId"
                  value={formik.values.memberId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Member ID"
                  error={formik.touched.memberId && formik.errors.memberId}
                />
                <FormTextField
                  label="Member Name"
                  name="memberName"
                  value={formik.values.memberName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Full name"
                  error={
                    formik.touched.memberName && formik.errors.memberName
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  label="Mobile"
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                  error={formik.touched.mobile && formik.errors.mobile}
                  required
                />
                <FormTextField
                  label="Establishment Name"
                  name="establishmentName"
                  value={formik.values.establishmentName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Company / Establishment"
                  error={
                    formik.touched.establishmentName &&
                    formik.errors.establishmentName
                  }
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
                  value={formik.values.group}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Group A"
                  error={formik.touched.group && formik.errors.group}
                  required
                />
                <FormTextField
                  label="Task"
                  name="task"
                  value={formik.values.task}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Data Entry"
                  error={formik.touched.task && formik.errors.task}
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
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Brief subject of the tapal"
                  error={formik.touched.subject && formik.errors.subject}
                />
              </div>
              <FormFileUpload
                files={files}
                onChange={handleFilesAdd}
                onRemove={handleFileRemove}
                error={fileError}
              />
            </div>

            {/* Actions */}
            <ReceiptFormActions
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          EPFO Regional Office, Chennai · Tapal Management System · Ministry of
          Labour & Employment
        </p>
      </div>
    </section>
  );
};

export default Receipt;