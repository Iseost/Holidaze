import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/Auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setError(null);
    setSuccess(null);

    // Validate email
    if (!email.trim()) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      setEmailError("Email must end with @student.noroff.no.");
      return;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await login(email, password);
      setSuccess("Great to see you again! Signing you in — just a moment…");
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-(--bg-body) rounded-lg shadow-xl max-w-md w-full p-8 relative">
        <Link
          to="/"
          className="absolute top-4 right-4 text-(--text-sub) hover:text-gray-600 text-2xl"
        >
          ×
        </Link>
        <h1 className="text-2xl font-bold  text-(--text-body) mb-6 text-center">
          Login
        </h1>
        {success && (
          <div className="bg-success text-(--bg-header) text-sm rounded-lg font-semibold p-1 mt-2 mb-2 text-center transition-opacity duration-500 opacity-100">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
            {emailError && (
              <div className="bg-error text-(--bg-header) rounded-lg text-sm font-semibold text-center p-1 mt-1">
                {emailError}
              </div>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
            {passwordError && (
              <div className="bg-error text-(--bg-header) rounded-lg text-sm font-semibold text-center p-1 mt-1">
                {passwordError}
              </div>
            )}
          </div>
          {error && (
            <div className="bg-error text-(--bg-header) rounded-lg text-sm font-semibold text-center p-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-3 font-semibold"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-(--text-sub) hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
