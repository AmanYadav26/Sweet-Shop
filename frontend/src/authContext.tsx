import { createContext, useContext, useState, ReactNode } from "react";

/* =============================================================
   TYPES & INTERFACES
   ============================================================= */

/**
 * AuthUser
 * --------
 * Represents the authenticated user object returned by backend.
 * Optional fields allow flexibility if backend evolves.
 */
interface AuthUser {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  [key: string]: any; // Allows additional properties without breaking typing
}

/**
 * AuthState
 * ---------
 * Represents the authentication state of the application.
 */
interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

/**
 * AuthContextType
 * ---------------
 * Defines what values and actions are available through AuthContext.
 */
interface AuthContextType {
  auth: AuthState;
  login: (data: { token: string; user: AuthUser }) => void;
  logout: () => void;
}

/* =============================================================
   AUTH CONTEXT CREATION
   ============================================================= */

/**
 * AuthContext
 * -----------
 * Global context for authentication state.
 * Initialized with null to enforce provider usage.
 */
const AuthContext = createContext<AuthContextType | null>(null);

/* =============================================================
   AUTH PROVIDER
   ============================================================= */

/**
 * AuthProvider
 * ------------
 * Wraps the application and provides authentication state
 * and actions (login/logout) to all child components.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Initialize auth state from localStorage
   * ---------------------------------------
   * This allows the user to stay logged in even after page refresh.
   */
  const [auth, setAuth] = useState<AuthState>({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token"),
  });

  /**
   * login
   * -----
   * Stores token and user data in localStorage
   * and updates global auth state.
   */
  const login = (data: { token: string; user: AuthUser }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setAuth({
      user: data.user,
      token: data.token
    });
  };

  /**
   * logout
   * ------
   * Clears authentication data and resets auth state.
   * This immediately logs the user out across the app.
   */
  const logout = () => {
    localStorage.clear();
    setAuth({ user: null, token: null });
  };

  /**
   * Provide auth state and actions to the app
   */
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* =============================================================
   CUSTOM HOOK
   ============================================================= */

/**
 * useAuth
 * -------
 * Custom hook to safely consume AuthContext.
 * Throws an error if used outside AuthProvider,
 * preventing silent bugs.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};
