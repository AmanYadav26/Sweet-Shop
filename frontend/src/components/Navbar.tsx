import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../authContext";

/**
 * Navbar Component
 * ----------------
 * Provides global navigation across the application.
 * Responsibilities:
 * - Display app branding
 * - Show navigation links based on user role
 * - Highlight active route
 * - Display logged-in user's name
 * - Provide logout functionality
 *
 * The Navbar reacts to authentication state
 * and updates automatically when user logs in/out.
 */
export default function Navbar() {
  // Access authenticated user and logout function from global auth context
  const { auth, logout } = useAuth();

  // Used to determine the current route for active link styling
  const location = useLocation();

  /**
   * isActive()
   * ----------
   * Utility function to highlight the currently active route.
   * Improves navigation clarity and user orientation.
   */
  const isActive = (path: string) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  return (
    // Sticky navbar with backdrop blur for modern UI feel
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LEFT SECTION: Brand + Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Application Logo / Brand */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 tracking-wide"
          >
            🍬 SweetShop
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className={isActive("/")}>
              Dashboard
            </Link>

            {/* Admin link is conditionally rendered for admin users only */}
            {auth.user?.isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 ${isActive("/admin")}`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: User Info + Logout */}
        <div className="flex items-center gap-4">
          {/* Display user's name (fallback to email if name not available) */}
          {auth.user && (
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {auth.user.name || auth.user.email}
            </span>
          )}

          {/* Logout button only visible when user is authenticated */}
          {auth.token && (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-lg text-sm font-medium
                         bg-red-500 text-white hover:bg-red-600
                         transition active:scale-95"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation (visible on small screens only) */}
      <div className="md:hidden border-t px-6 py-3 flex gap-4">
        <Link to="/" className={isActive("/")}>
          Dashboard
        </Link>

        {auth.user?.isAdmin && (
          <Link to="/admin" className={isActive("/admin")}>
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
