//login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Changed Navigate to useNavigate
import { login } from "../api/Auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Add this hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/"); // Changed Navigate to navigate (lowercase)
    } catch {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-body)] rounded-lg shadow-xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-[var(--text-sub)] hover:text-gray-600 text-2xl"
        >
          ×
        </Link>
        <h1 className="text-2xl font-bold  text-[var(--text-body)] mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none "
          />
          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none "
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg px-4 py-3 font-semibold"
          >
            Login
          </button>
          {/* register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[var(--text-sub)] hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
