import * as Yup from "yup";

export const receiptValidationSchema = Yup.object({

  receiptDate: Yup.date()
    .typeError("Receipt date is required")
    .required("Receipt date is required"),

  receiptMode: Yup.string()
    .required("Receipt mode is required"),

  formType: Yup.string()
    .required("Form type is required"),

  formTypeOther: Yup.string().when("formType", {
    is: "Other",
    then: (schema) =>
      schema.trim().required("Please specify the form type"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // ✅ UAN — required if memberId is empty
  uan: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "uan-format",
      "UAN must be exactly 12 digits",
      (value) => {
        if (!value || value.trim() === "") return true;
        return /^\d{12}$/.test(value);
      }
    )
    .test(
      "uan-or-memberId",
      "Enter UAN or Member ID (at least one is required)",
      function (value) {
        const { memberId } = this.parent;
        const uanFilled = value && value.trim() !== "";
        const memberIdFilled = memberId && memberId.trim() !== "";
        return uanFilled || memberIdFilled;
      }
    ),

  // ✅ Member ID — required if UAN is empty
  memberId: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "memberId-or-uan",
      "Enter Member ID or UAN (at least one is required)",
      function (value) {
        const { uan } = this.parent;
        const uanFilled = uan && uan.trim() !== "";
        const memberIdFilled = value && value.trim() !== "";
        return uanFilled || memberIdFilled;
      }
    ),

  // ✅ Member Name — Optional, but if entered must be valid
  memberName: Yup.string()
    .notRequired()
    .nullable()
    .test(
      "memberName-format",
      "Member name must contain only letters and spaces",
      (value) => {
        if (!value || value.trim() === "") return true; // Optional
        return /^[a-zA-Z\s]+$/.test(value.trim());
      }
    ),

  // ✅ Mobile — Optional, but if entered must be 10 digits
  mobile: Yup.string()
    .notRequired()
    .nullable()
    .test(
      "mobile-format",
      "Mobile number must be exactly 10 digits",
      (value) => {
        if (!value || value.trim() === "") return true; // Optional
        return /^\d{10}$/.test(value);
      }
    ),

  // ✅ Establishment Name — Optional
  establishmentName: Yup.string().notRequired(),

  group: Yup.string()
    .trim()
    .required("Group is required"),

  // ✅ Task — Optional
  task: Yup.string().notRequired(),

  // ✅ Subject — Required
  subject: Yup.string()
    .trim()
    .required("Subject is required"),

});