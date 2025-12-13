import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import mongoose from "mongoose";
import app from "./app";

/* =============================================================
   SERVER CONFIGURATION
   ============================================================= */

/**
 * Server port
 * -----------
 * Uses environment variable if provided,
 * otherwise defaults to 4000.
 */
const PORT = process.env.PORT || 4000;

/* =============================================================
   APPLICATION BOOTSTRAP
   ============================================================= */

/**
 * start
 * -----
 * Initializes database connection and starts the Express server.
 *
 * Flow:
 * 1. Validate required environment variables
 * 2. Connect to MongoDB
 * 3. Start HTTP server
 */
const start = async () => {
  /**
   * Ensure MongoDB connection string exists
   * --------------------------------------
   * Fail fast if critical configuration is missing.
   */
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI");
  }

  /**
   * Connect to MongoDB
   * ------------------
   * Mongoose manages connection pooling internally.
   */
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  /**
   * Start Express server
   * -------------------
   * Begins listening for incoming HTTP requests.
   */
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
};

/**
 * Start the application
 * ---------------------
 * Any unhandled startup error is logged to the console.
 */
start().catch((err) => console.error(err));
