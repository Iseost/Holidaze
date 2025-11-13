//register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/Auth";
import { NIL } from "uuid";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("customer");

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);
    setSuccess(null);

    if (!name.trim()) {
      setNameError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      setEmailError("Email must end with @stud.noroff.no");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Please enter a password with at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords don't match!");
      return;
    }

    try {
      await register(email, password, name, userType === "venueManager");
      setSuccess(
        "You’ve successfully registered! Taking you to the login page…"
      );
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setEmailError(err.message || "Registration failed. Please try again.");
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

        <h1 className="text-2xl font-bold text-[var(--text-body)] mb-6 text-center">
          Register
        </h1>

        {/* User Type Selection */}
        <div className="flex justify-center gap-8 py-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              value="customer"
              checked={userType === "customer"}
              onChange={(e) => setUserType(e.target.value)}
              className="w-4 h-4 text-primary focus:ring-primary-hover"
            />
            <span className="text-[var(--text-body)]">Customer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              value="venueManager"
              checked={userType === "venueManager"}
              onChange={(e) => setUserType(e.target.value)}
              className="w-4 h-4 text-primary focus:ring-primary-hover"
            />
            <span className="text-[var(--text-body)]">Venue Manager</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
            />
            {nameError && (
              <div className="bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-1 mt-2">
                {nameError}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email (@stud.noroff.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border  bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
            />
            {emailError && (
              <div className="bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-1 mt-2">
                {emailError}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border  bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
            />
            {passwordError && (
              <div className="bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-1 mt-2">
                {passwordError}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              className="w-full px-4 py-3 border  bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
            />
            {confirmError && (
              <div className="bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-1 mt-2">
                {confirmError}
              </div>
            )}
          </div>

          {/* success message */}

          {success && (
            <div className="bg-[var(--color-success)] text-[var(--bg-header)] text-sm rounded-lg font-semibold p-1 mt-2 mb-2 text-center transition-opacity duration-500 opacity-100">
              {success}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--text-sub)] hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
