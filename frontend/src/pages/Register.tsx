import { useState } from "react";
import { authAPI } from "../api";
import { useNavigate, Link } from "react-router-dom";

/**
 * Register Component
 * ------------------
 * Handles user registration flow:
 * - Collects user details
 * - Validates input on client side
 * - Calls backend register API
 * - Redirects user to login on success
 */
export default function Register() {
  // Used for programmatic navigation after successful registration
  const navigate = useNavigate();

  // Local state to store form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Loading state to prevent duplicate submissions
  const [loading, setLoading] = useState(false);

  /**
   * submit()
   * --------
   * Triggered when user clicks "Register"
   * 1. Validates required fields
   * 2. Calls backend API
   * 3. Redirects to login page on success
   */
  const submit = async () => {
    // Client-side validation to improve UX
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Disable button and show loading feedback
      setLoading(true);

      // Call backend API to create new user
      await authAPI.register(form);

      // Redirect user to login page after successful registration
      navigate("/login");
    } catch (err: any) {
      // Handle API or network errors gracefully
      alert(err.message || "Registration failed");
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  return (
    // Full-screen centered layout with soft gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-slideFade">

        {/* Page heading */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create Account
        </h2>

        {/* Subtitle for context */}
        <p className="text-center text-gray-500 mb-8">
          Welcome to Sweet Shop Management
        </p>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 outline-none"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 outline-none"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-semibold text-white
            transition-all duration-200 transform
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
            }`}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Navigation to Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
