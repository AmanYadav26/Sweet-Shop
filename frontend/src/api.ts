/**
 * Base API URL
 * ------------
 * Loaded from Vite environment variables.
 * This allows switching between development, staging, and production
 * without changing source code.
 *
 * Example:
 * VITE_API_URL=http://localhost:4000/api
 */
const BASE = import.meta.env.VITE_API_URL;

/* =============================================================
   AUTHENTICATION API
   ============================================================= */

/**
 * authAPI
 * -------
 * Handles all authentication-related network requests.
 * This separation keeps auth logic isolated from business logic
 * (Single Responsibility Principle).
 */
export const authAPI = {
  /**
   * Register a new user
   * -------------------
   * Sends user details to backend to create an account.
   * Backend is responsible for validation, hashing password, etc.
   */
  register: async (data: any) => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    // Explicit error handling improves debuggability
    if (!res.ok) throw new Error("Registration failed");

    return res.json();
  },

  /**
   * Login user
   * ----------
   * On success, backend returns JWT token and user details.
   * Token is later stored in localStorage by AuthContext.
   */
  login: async (data: any) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Invalid email or password");

    return res.json();
  }
};

/* =============================================================
   SWEETS API
   ============================================================= */

/**
 * sweetsAPI
 * ---------
 * Encapsulates all API calls related to sweets management.
 * Protected routes require Authorization header.
 */
export const sweetsAPI = {
  /**
   * Fetch all available sweets
   * --------------------------
   * Used in Dashboard and Admin Panel.
   */
  list: async () => {
    const res = await fetch(`${BASE}/sweets`, {
      headers: authHeader()
    });

    return res.json();
  },

  /**
   * Search sweets by query parameters
   * ---------------------------------
   * Supports name, category, and price filters.
   */
  search: async (query: string) => {
    const res = await fetch(`${BASE}/sweets/search?${query}`, {
      headers: authHeader()
    });

    return res.json();
  },

  /**
   * Create a new sweet (Admin only)
   * -------------------------------
   * Adds a sweet to inventory with initial quantity.
   */
  create: async (data: any) => {
    const res = await fetch(`${BASE}/sweets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  /**
   * Update an existing sweet (Admin only)
   * -------------------------------------
   * Used for editing name, category, or price.
   */
  update: async (id: string, data: any) => {
    const res = await fetch(`${BASE}/sweets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  /**
   * Delete a sweet (Admin only)
   * ---------------------------
   * Removes sweet completely from inventory.
   */
  delete: async (id: string) => {
    const res = await fetch(`${BASE}/sweets/${id}`, {
      method: "DELETE",
      headers: authHeader()
    });

    return res.json();
  },

  /**
   * Purchase a sweet
   * ----------------
   * Decreases quantity by 1.
   * Button is disabled in UI when quantity is 0.
   */
  purchase: async (id: string) => {
    const res = await fetch(`${BASE}/sweets/${id}/purchase`, {
      method: "POST",
      headers: authHeader()
    });

    return res.json();
  },

  /**
   * Restock a sweet (Admin only)
   * ----------------------------
   * Increases quantity by provided amount.
   */
  restock: async (id: string, quantity: number) => {
    const res = await fetch(`${BASE}/sweets/${id}/restock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
      body: JSON.stringify({ quantity })
    });

    return res.json();
  }
};

/* =============================================================
   AUTHORIZATION HEADER
   ============================================================= */

/**
 * authHeader
 * ----------
 * Generates Authorization header for protected routes.
 * Token is read from localStorage where it is stored
 * after successful login.
 *
 * Centralizing this avoids repetition and bugs.
 */
export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});
