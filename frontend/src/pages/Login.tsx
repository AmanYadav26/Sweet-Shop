import { useState } from "react";
import { authAPI } from "../api";
import { useAuth } from "../authContext";
import { Link, useNavigate } from "react-router-dom";

/**
 * Login Component
 * ----------------
 * Handles user authentication flow:
 * - Accepts user credentials
 * - Validates input before submission
 * - Calls backend login API
 * - Stores auth data in global context
 * - Redirects user to dashboard on success
 */
export default function Login() {
  // Used to redirect user after successful login
  const navigate = useNavigate();

  // Access global auth context to store user & token
  const { login } = useAuth();

  // Local state for controlled form inputs
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // Loading state to prevent multiple login attempts
  const [loading, setLoading] = useState(false);

  /**
   * submit()
   * --------
   * Triggered when user clicks "Login"
   * 1. Validates required fields
   * 2. Sends credentials to backend
   * 3. Saves auth data globally
   * 4. Redirects to dashboard
   */
  const submit = async () => {
    // Basic client-side validation for better UX
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Disable button and show loading feedback
      setLoading(true);

      // Authenticate user via backend API
      const data = await authAPI.login(form);

      // Store token & user data in AuthContext
      login(data);

      // Redirect authenticated user to dashboard
      navigate("/");
    } catch (err: any) {
      // Handle invalid credentials or network errors
      alert(err.message || "Login failed");
    } finally {
      // Ensure loading state resets in all cases
      setLoading(false);
    }
  };

  return (
    // Full-page centered layout with soft gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-slideFade">

        {/* Page heading */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>

        {/* Subheading */}
        <p className="text-center text-gray-500 mb-8">
          Login to manage sweets 🍭
        </p>

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
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Navigation to Register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
