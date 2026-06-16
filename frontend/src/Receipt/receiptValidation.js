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
    is: "other",
    then: (schema) =>
      schema.trim().required("Please specify the form type"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // ✅ UAN — valid only if entered, required if memberId is empty
  uan: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "uan-format",
      "UAN must be exactly 12 digits",
      (value) => {
        if (!value || value.trim() === "") return true; // optional if memberId filled
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

  memberName: Yup.string()
    .trim()
    .required("Member name is required"),

  // ✅ Mobile — Required
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

  // ✅ Establishment Name — Optional
  establishmentName: Yup.string().notRequired(),

  group: Yup.string()
    .trim()
    .required("Group is required"),

  // ✅ Task — Optional
  task: Yup.string().notRequired(),

  subject: Yup.string().notRequired(),
});