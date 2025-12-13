import { useEffect, useState } from "react";
import { sweetsAPI } from "../api";
import SweetCard from "../components/SweetCard";

export default function Dashboard() {
  const [sweets, setSweets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await sweetsAPI.list();
    setSweets(data);
    setLoading(false);
  };

  const doSearch = async () => {
    setLoading(true);
    const q = new URLSearchParams({ name: search }).toString();
    const results = await sweetsAPI.search(q);
    setSweets(results);
    setLoading(false);
  };

 const purchase = async (id: string) => {
  const updatedSweet = await sweetsAPI.purchase(id);

  setSweets((prev) =>
    prev.map((s: any) =>
      s._id === id ? updatedSweet : s
    )
  );
};


  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🍬 Sweets Dashboard
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={doSearch}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white
                       hover:bg-blue-700 transition"
          >
            Search
          </button>

          <button
            onClick={load}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700
                       hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 mt-20">Loading sweets...</p>
        ) : sweets.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No sweets found 🍭
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sweets.map((s) => (
              <SweetCard key={s._id} sweet={s} onPurchase={purchase} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
