import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("customer");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    console.log({
      name,
      email,
      password,
      venueManager: userType === "venueManager",
    });
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
              className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary-hover)]"
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
              className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary-hover)]"
            />
            <span className="text-[var(--text-body)]">Venue Manager</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border  bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border  bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border  bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 rounded-lg transition-colors duration-200"
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
