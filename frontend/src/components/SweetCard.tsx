import { useState } from "react";

/**
 * SweetCard Component
 * ------------------
 * Represents a single sweet item in the dashboard.
 * Responsibilities:
 * - Display sweet details (name, category, price, stock)
 * - Allow user to purchase if stock is available
 * - Show loading state during purchase action
 *
 * The component is intentionally kept stateless with respect
 * to data updates — state updates are delegated to parent.
 */
export default function SweetCard({ sweet, onPurchase }: any) {
  // Local loading state to prevent multiple purchase clicks
  const [loading, setLoading] = useState(false);

  /**
   * handlePurchase()
   * ----------------
   * Triggered when user clicks the Purchase button.
   * Delegates the actual purchase logic to parent component
   * while managing local loading state for better UX.
   */
  const handlePurchase = async () => {
    setLoading(true);

    // Parent handles API call and state update
    await onPurchase(sweet._id);

    setLoading(false);
  };

  return (
    // Card container with subtle hover animation for better affordance
    <div
      className="bg-white rounded-xl shadow-lg p-5
                 hover:shadow-xl transition transform hover:-translate-y-1"
    >
      {/* Sweet Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {sweet.name}
      </h3>

      {/* Category Information */}
      <p className="text-sm text-gray-500 mb-2">
        Category: {sweet.category}
      </p>

      {/* Price */}
      <p className="text-gray-700 mb-1">
        Price: ₹{sweet.price}
      </p>

      {/* Stock Status */}
      <p className="text-gray-700 mb-4">
        Stock:{" "}
        <span
          className={`font-semibold ${
            // Visually communicate availability
            sweet.quantity === 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          {sweet.quantity}
        </span>
      </p>

      {/* Purchase Button */}
      <button
        disabled={sweet.quantity === 0 || loading}
        onClick={handlePurchase}
        className={`w-full py-2 rounded-lg font-semibold text-white transition
          ${
            // Disable interaction when out of stock or request in progress
            sweet.quantity === 0 || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {/* Dynamic button label for better user feedback */}
        {loading
          ? "Purchasing..."
          : sweet.quantity === 0
          ? "Out of Stock"
          : "Purchase"}
      </button>
    </div>
  );
}
