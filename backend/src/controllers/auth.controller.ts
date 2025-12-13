import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

/* =============================================================
   JWT TOKEN HELPER
   ============================================================= */

/**
 * signToken
 * ---------
 * Generates a signed JWT token for authenticated users.
 * The token contains the user's MongoDB ID as payload.
 *
 * @param id - MongoDB user ID
 * @returns Signed JWT token string
 */
const signToken = (id: string): string => {
  return jwt.sign(
    { id } as jwt.JwtPayload,            // Payload (kept minimal for security)
    process.env.JWT_SECRET as string,    // Secret key from environment
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d" // Token expiration
    } as jwt.SignOptions
  );
};

/* =============================================================
   REGISTER CONTROLLER
   ============================================================= */

/**
 * register
 * --------
 * Handles new user registration.
 *
 * Flow:
 * 1. Validate email uniqueness
 * 2. Determine admin role (based on env config)
 * 3. Create user (password hashing handled by Mongoose middleware)
 * 4. Generate JWT token
 * 5. Return token + user data
 */
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already used" });
  }

  /**
   * Admin detection
   * ----------------
   * Admin emails are configured via environment variables.
   * This avoids hardcoding admin logic in code.
   */
  const isAdmin =
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .includes(email);

  // Create user (password hashing happens in pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    isAdmin
  });

  // Generate authentication token
  const token = signToken(user._id.toString());

  // Respond with token and user info
  res.status(201).json({ token, user });
};

/* =============================================================
   LOGIN CONTROLLER
   ============================================================= */

/**
 * login
 * -----
 * Authenticates an existing user.
 *
 * Flow:
 * 1. Find user by email
 * 2. Validate password
 * 3. Generate JWT token
 * 4. Return token + user data
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // If user does not exist
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare hashed password
  const valid = await user.comparePassword(password);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = signToken(user._id.toString());

  // Successful authentication response
  res.json({ token, user });
};
