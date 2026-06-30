import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await axiosClient.post("/api/auth/login", { username, password });
      login({ token: data.token, user: data.user });

      // redirect by role
      if (data.user.role === "DEO") nav("/receipts");
      else nav("/ack");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded-2xl p-6 shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

        <label className="text-sm">Username</label>
        <input className="w-full border rounded-xl h-10 px-3 mb-3"
          value={username} onChange={(e) => setUsername(e.target.value)} />

        <label className="text-sm">Password</label>
        <input type="password" className="w-full border rounded-xl h-10 px-3 mb-4"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full h-10 rounded-xl bg-blue-700 text-white font-semibold">
          Login
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Test users: deo/deo123, staff/staff123
        </p>
      </form>
    </div>
  );
};

export default Login;