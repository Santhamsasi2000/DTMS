import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import * as Yup from "yup";
import { useAuth } from "../auth/AuthContext";
import axiosClient from "../api/axiosClient";


const ROLE_OPTIONS = [
  { value: "RECEIPT",      label: "Receipt" },
  { value: "ACKNOWLEDGE",  label: "Acknowledgement" },
  { value: "REPORTS",      label: "Reports" },
];

const validationSchema = Yup.object({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string().oneOf(["RECEIPT", "ACKNOWLEDGE", "REPORTS"]).required("Role is required"),
});

const Login = () => {
  const { login, user } = useAuth();
  const navigate        = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");

      try {
        const { data } = await axiosClient.post("/api/auth/login", {
          username: values.username.trim(),
          password: values.password,
          role: values.role
        })
        login({ token: data.token, user: data.user });

        if (data.user.role === "RECEIPT") navigate("/tapal/receipt-entry", { replace: true });
        else if (data.user.role === "ACKNOWLEDGE") navigate("/tapal/acknowledgement", { replace: true });
        else navigate("/tapal/reports", { replace: true });
      } catch (err) {
        setError(
          err.response?.data?.message || "Invalid username or password"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

 // already logged in
  if (user) {
    if (user.role === "RECEIPT") return <Navigate to="/tapal/receipt-entry" replace />;
    if (user.role === "ACKNOWLEDGE") return <Navigate to="/tapal/acknowledgement" replace />;
    return <Navigate to="/tapal/reports" replace />;
  }


  // ✅ Input class helper
  const inputClass = (field) =>
    `w-full border rounded-2xl px-4 py-3 outline-none transition text-sm ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 focus:border-sky-500 bg-white"
    }`;

  return (
    <section className="min-h-screen bg-blue-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-blue-500 px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-5 mb-3">
            <img
              src="/logo.png"
              alt="EPFO Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <h1 className="text-white text-2xl font-bold font-sora">
            EPFO Regional Office, Chennai
          </h1>
          <p className="text-sky-100 mt-1 text-sm">
            Digital Tapal Management System
          </p>
        </div>

        {/* ── Form ── */}
        <div className="px-8 py-8">

          <h2 className="text-xl font-bold text-[#0f172a] mb-6">
            Sign in to continue
          </h2>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
              px-4 py-3 rounded-2xl text-sm mb-5">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-5">
            <label className="text-sm text-gray-500 mb-2 block">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass("username")}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-xs mt-1.5 pl-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass("password")}
              />
              {/* ✅ Show/Hide Password */}
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-gray-600 transition"
              >
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1.5 pl-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* ✅ Role Dropdown */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 mb-2 block">Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass("role")}
            >
              <option value="">— Select Role —</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="text-red-500 text-xs mt-1.5 pl-1">{formik.errors.role}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
            className="w-full bg-sky-600 hover:bg-sky-700
              disabled:bg-sky-300 text-white py-3 rounded-2xl
              font-medium transition active:scale-[0.98]"
          >
            {formik.isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>

        </div>

        {/* ── Footer ── */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">
            EPFO Regional Office, Chennai · Ministry of Labour & Employment
          </p>
        </div>

      </div>
    </section>
  );
};

export default Login;