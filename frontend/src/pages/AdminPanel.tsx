import { useEffect, useState } from "react";
import { sweetsAPI } from "../api";

/**
 * AdminPanel Component
 * -------------------
 * Responsible for managing sweets inventory.
 * Admin users can:
 * - View all sweets
 * - Add new sweets
 * - Update existing sweets
 * - Restock quantities
 * - Delete sweets
 *
 * The component avoids full page reloads by
 * updating local state after each action.
 */
export default function AdminPanel() {
  // Stores list of sweets fetched from backend
  const [sweets, setSweets] = useState<any[]>([]);

  // Indicates initial data loading state
  const [loading, setLoading] = useState(false);

  // Controlled form state for creating new sweet
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

  // Stores sweet currently being edited (null when not editing)
  const [editing, setEditing] = useState<any>(null);

  // Stores per-sweet restock quantity to avoid shared input state
  const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>(
    {}
  );

  /**
   * Fetch sweets from backend once when component mounts.
   * This avoids unnecessary refetching on every action.
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await sweetsAPI.list();
      setSweets(data);
      setLoading(false);
    })();
  }, []);

  /**
   * Creates a new sweet.
   * After successful creation, updates local state
   * instead of refetching entire list.
   */
  const create = async () => {
    if (!form.name || !form.category || !form.price || !form.quantity) return;

    const newSweet = await sweetsAPI.create({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity)
    });

    // Optimistically update UI
    setSweets((prev) => [newSweet, ...prev]);

    // Reset form fields
    setForm({ name: "", category: "", price: "", quantity: "" });
  };

  /**
   * Saves updates to an existing sweet.
   * Only the edited sweet is updated in state.
   */
  const saveEdit = async () => {
    const updated = await sweetsAPI.update(editing._id, {
      name: editing.name,
      category: editing.category,
      price: Number(editing.price)
    });

    setSweets((prev) =>
      prev.map((s) => (s._id === editing._id ? updated : s))
    );

    // Close edit modal
    setEditing(null);
  };

  /**
   * Deletes a sweet after confirmation.
   * Removes the sweet from local state.
   */
  const remove = async (id: string) => {
    if (!confirm("Delete this sweet?")) return;

    await sweetsAPI.delete(id);
    setSweets((prev) => prev.filter((s) => s._id !== id));
  };

  /**
   * Restocks a sweet with provided quantity.
   * Uses per-row state to avoid affecting other inputs.
   */
  const restock = async (id: string) => {
    const qty = restockAmounts[id];
    if (!qty) return;

    const updated = await sweetsAPI.restock(id, Number(qty));

    setSweets((prev) =>
      prev.map((s) => (s._id === id ? updated : s))
    );

    // Clear restock input only for this sweet
    setRestockAmounts((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Inventory management</p>
        </div>

        {/* ADD NEW SWEET */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">Add New Sweet</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="input" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="input" type="number" placeholder="Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" type="number" placeholder="Quantity" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>

          <button
            onClick={create}
            className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white
                       hover:bg-blue-700 transition active:scale-95"
          >
            Add Sweet
          </button>
        </div>

        {/* SWEETS LIST */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Existing Sweets</h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : (
            <div className="divide-y">
              {sweets.map((s) => (
                <div
                  key={s._id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4
                             hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-gray-500">{s.category}</p>
                  </div>

                  <div className="text-gray-700">₹{s.price}</div>
                  <div className="font-medium">{s.quantity}</div>

                  {/* RESTOCK */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="+Qty"
                      value={restockAmounts[s._id] || ""}
                      onChange={(e) =>
                        setRestockAmounts((prev) => ({
                          ...prev,
                          [s._id]: e.target.value
                        }))
                      }
                      className="w-20 input"
                    />
                    <button
                      onClick={() => restock(s._id)}
                      className="px-3 py-1.5 rounded-md
                                 bg-slate-100 text-slate-700
                                 hover:bg-slate-200
                                 border border-slate-200 transition"
                    >
                      Restock
                    </button>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing({ ...s })}
                      className="px-3 py-1.5 rounded-md
                                 bg-indigo-50 text-indigo-700
                                 hover:bg-indigo-100
                                 border border-indigo-100 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => remove(s._id)}
                      className="px-3 py-1.5 rounded-md
                                 bg-rose-50 text-rose-700
                                 hover:bg-rose-100
                                 border border-rose-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Sweet</h3>

              <input className="input mb-3" value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <input className="input mb-3" value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <input className="input mb-4" type="number" value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })} />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
