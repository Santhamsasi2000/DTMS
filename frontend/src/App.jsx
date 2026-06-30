import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import RequireRole from "./auth/RequireRole";

import TapalLayout    from "./pages/TapalLayout";
import Login          from "./pages/Login";
import Receipt        from "./Receipt/Receipt";
import Acknowledgement from "./Acknowledgement/Acknowledgement";
import Reports        from "./Reports/Reports";

// ─── Unauthorized page ────────────────────────────────────────────────────────
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <p className="text-2xl font-bold text-red-600 mb-2">403 — Forbidden</p>
      <p className="text-gray-500 text-sm">
        You don't have permission to access this page.
      </p>
      <a href="/login" className="text-blue-600 text-sm mt-4 inline-block underline">
        Go to Login
      </a>
    </div>
  </div>
);

function App() {
  const { user } = useAuth();

  return (
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/tapal"
        element={
          <RequireRole roles={["RECEIPT", "ACKNOWLEDGE", "REPORTS"]}>
            <TapalLayout />
          </RequireRole>
        }
      >
        <Route
          path="receipt-entry"
          element={
            <RequireRole roles={["RECEIPT"]}>
              <Receipt />
            </RequireRole>
          }
        />

        <Route
          path="acknowledgement"
          element={
            <RequireRole roles={["ACKNOWLEDGE"]}>
              <Acknowledgement />
            </RequireRole>
          }
        />

        <Route
          path="reports"
          element={
            <RequireRole roles={["RECEIPT", "ACKNOWLEDGE", "REPORTS"]}>
              <Reports />
            </RequireRole>
          }
        />
      </Route>

      {/* default */}
      <Route
        path="/"
        element={
          user?.role === "RECEIPT"
            ? <Navigate to="/tapal/receipt-entry" replace />
            : user?.role === "ACKNOWLEDGE"
            ? <Navigate to="/tapal/acknowledgement" replace />
            : user?.role === "REPORTS"
            ? <Navigate to="/tapal/reports" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;