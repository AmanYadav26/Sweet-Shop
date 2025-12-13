import { Request, Response } from "express";
import Sweet from "../models/Sweet";

/* =============================================================
   CREATE SWEET
   ============================================================= */

/**
 * createSweet
 * -----------
 * Creates a new sweet item in the inventory.
 * Accessible only to admin users (enforced via middleware).
 *
 * Expected body:
 * {
 *   name: string,
 *   category: string,
 *   price: number,
 *   quantity: number
 * }
 */
export const createSweet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Create new sweet document
    const sweet = await Sweet.create(req.body);

    // Return created resource
    return res.status(201).json(sweet);
  } catch (err) {
    // Handles validation and database errors
    return res
      .status(400)
      .json({ message: "Unable to create sweet", error: err });
  }
};

/* =============================================================
   LIST SWEETS
   ============================================================= */

/**
 * listSweets
 * ----------
 * Returns all available sweets from the database.
 * Used by both admin and regular users.
 */
export const listSweets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const sweets = await Sweet.find();
  return res.json(sweets);
};

/* =============================================================
   SEARCH SWEETS
   ============================================================= */

/**
 * searchSweets
 * ------------
 * Searches sweets using optional query parameters.
 *
 * Supported filters:
 * - name (partial, case-insensitive)
 * - category
 * - minPrice
 * - maxPrice
 *
 * Example:
 * /api/sweets/search?name=laddu&minPrice=50
 */
export const searchSweets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    // Dynamic MongoDB filter object
    const filter: any = {};

    // Partial name search (case-insensitive)
    if (name) {
      filter.name = { $regex: name as string, $options: "i" };
    }

    // Exact category match
    if (category) {
      filter.category = category;
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const results = await Sweet.find(filter);
    return res.json(results);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Search failed", error: err });
  }
};

/* =============================================================
   UPDATE SWEET
   ============================================================= */

/**
 * updateSweet
 * -----------
 * Updates details of an existing sweet.
 * Admin-only operation.
 *
 * Supports partial updates.
 */
export const updateSweet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sweet = await Sweet.findByIdAndUpdate(id, updates, {
      new: true // Return updated document
    });

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.json(sweet);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Unable to update sweet", error: err });
  }
};

/* =============================================================
   DELETE SWEET
   ============================================================= */

/**
 * deleteSweet
 * -----------
 * Permanently removes a sweet from inventory.
 * Admin-only operation.
 */
export const deleteSweet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Unable to delete sweet", error: err });
  }
};

/* =============================================================
   PURCHASE SWEET
   ============================================================= */

/**
 * purchaseSweet
 * -------------
 * Decreases stock quantity by 1 when a user purchases a sweet.
 *
 * Validations:
 * - Sweet must exist
 * - Quantity must be greater than 0
 */
export const purchaseSweet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    // Decrease stock by 1
    sweet.quantity -= 1;
    await sweet.save();

    return res.json(sweet);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Unable to purchase sweet", error: err });
  }
};

/* =============================================================
   RESTOCK SWEET
   ============================================================= */

/**
 * restockSweet
 * ------------
 * Increases stock quantity by a given amount.
 * Admin-only operation.
 *
 * Expected body:
 * {
 *   quantity: number
 * }
 */
export const restockSweet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Not found" });
    }

    // Increase stock quantity
    sweet.quantity += Number(req.body.quantity);
    await sweet.save();

    return res.json(sweet);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Unable to restock sweet", error: err });
  }
};
