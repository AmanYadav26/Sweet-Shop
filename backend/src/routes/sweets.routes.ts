import { Router } from "express";
import {
  createSweet,
  deleteSweet,
  listSweets,
  updateSweet,
  purchaseSweet,
  restockSweet,
  searchSweets
} from "../controllers/sweets.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// List & Search
router.get("/", requireAuth, listSweets);
router.get("/search", requireAuth, searchSweets);

// Create, Update, Delete (Admin Only)
router.post("/", requireAuth, requireAdmin, createSweet);
router.put("/:id", requireAuth, requireAdmin, updateSweet);
router.delete("/:id", requireAuth, requireAdmin, deleteSweet);

// Inventory Operations
router.post("/:id/purchase", requireAuth, purchaseSweet);
router.post("/:id/restock", requireAuth, requireAdmin, restockSweet);

export default router;
