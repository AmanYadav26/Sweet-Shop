import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

/* =============================================================
   CUSTOM REQUEST TYPE
   ============================================================= */

/**
 * AuthRequest
 * -----------
 * Extends Express Request to include authenticated user data.
 * This allows downstream middleware and controllers
 * to safely access req.user.
 */
export interface AuthRequest extends Request {
  user?: any;
}

/* =============================================================
   AUTHENTICATION MIDDLEWARE
   ============================================================= */

/**
 * requireAuth
 * -----------
 * Protects routes by verifying JWT token.
 *
 * Flow:
 * 1. Extract Authorization header
 * 2. Verify JWT token
 * 3. Fetch user from database
 * 4. Attach user to request object
 * 5. Allow request to proceed
 */
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Authorization header should be in format: "Bearer <token>"
  const header = req.headers.authorization;

  // If no authorization header is present
  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  // Extract token from header
  const token = header.split(" ")[1];

  try {
    /**
     * Verify JWT token
     * ----------------
     * Decoded payload contains the user ID
     */
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    /**
     * Fetch user from database
     * ------------------------
     * Password is excluded for security reasons
     */
    const user = await User.findById(decoded.id).select("-password");

    // Attach user to request object
    req.user = user;

    // Continue to next middleware / controller
    next();
  } catch {
    // Token verification failed
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =============================================================
   AUTHORIZATION MIDDLEWARE
   ============================================================= */

/**
 * requireAdmin
 * ------------
 * Ensures that the authenticated user has admin privileges.
 * Must be used AFTER requireAuth middleware.
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // If user is not admin, block access
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin only" });
  }

  // User is admin → allow request
  next();
};
