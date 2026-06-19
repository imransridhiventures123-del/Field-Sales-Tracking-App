// ============================================================
// FILE: src/pages/PerformanceLedger.jsx
// OWNER: Imran
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEFAULT_PRODUCTS = [
  { id: "batter", name: "Batter", unit: "kg", margin: 3 },
  { id: "water", name: "Water", unit: "litre", margin: 1.5 },
];

export default function PerformanceLedger() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Real logged-in employee — falls back to safe defaults only if a field is missing
  const employee = {
    name: user?.name || "Employee",
    employeeId: user?.employeeId || "—",
    salary: user?.salary || 0,
    role: user?.role === "admin" ? "Admin" : "Field Sales",
  };

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("pl_products");
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // No backend model exists yet for ledger entries, so they're kept
  // per-device in local storage (same pattern as products) instead
  // of being fake/hardcoded. Starts empty for a real employee.
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(`pl_entries_${user?.employeeId || "default"}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [tab, setTab] = useState("overview");
  const [addType, setAddType] = useState("collection");
  const [form, setForm] = useState({ amount: "", productId: DEFAULT_PRODUCTS[0]?.id || "", qty: "", note: "" });
  const [formError, setFormError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", unit: "kg", margin: "" });
  const [toast, setToast] = useState("");

  const totalCollection = entries
    .filter((e) => e.type === "collection")
    .reduce((sum, e) => sum + e.amount, 0);

  const salesRevenue = entries
    .filter((e) => e.type === "sale")
    .reduce((sum, e) => {
      const product = products.find((p) => p.id === e.productId);
      return sum + (product ? product.margin * e.qty : 0);
    }, 0);

  const totalRevenue = totalCollection + salesRevenue;
  const dailySalaryCost = employee.salary / 30;
  const netResult = totalRevenue - dailySalaryCost;
  const isProfit = netResult >= 0;
  const pct = employee.salary > 0 ? (totalRevenue / employee.salary) * 100 : 0;

  const salesBreakdown = products.map((product) => {
    const productEntries = entries.filter((e) => e.type === "sale" && e.productId === product.id);
    const totalQty = productEntries.reduce((sum, e) => sum + e.qty, 0);
    const revenue = totalQty * product.margin;
    return { ...product, totalQty, revenue, count: productEntries.length };
  });

  useEffect(() => {
    localStorage.setItem("pl_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`pl_entries_${user?.employeeId || "default"}`, JSON.stringify(entries));
  }, [entries, user?.employeeId]);

  function handleAddEntry() {
    setFormError("");
    if (addType === "collection") {
      const amt = parseFloat(form.amount);
      if (!amt || amt <= 0) return setFormError("Enter a valid amount.");
      setEntries((prev) => [...prev, { type: "collection", amount: amt, note: form.note || "Manual entry" }]);
    } else {
      const qty = parseFloat(form.qty);
      if (!form.productId) return setFormError("Select a product.");
      if (!qty || qty <= 0) return setFormError("Enter a valid quantity.");
      setEntries((prev) => [...prev, { type: "sale", productId: form.productId, qty, note: form.note || "Manual entry" }]);
    }
    setForm({ amount: "", productId: products[0]?.id || "", qty: "", note: "" });
    showToast("Entry added.");
    setTab("overview");
  }

  function handleSaveMargin() {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) => p.id === editingProduct.id ? { ...p, margin: parseFloat(editingProduct.margin) || p.margin } : p)
    );
    setEditingProduct(null);
    showToast("Margin updated.");
  }

  function handleAddProduct() {
    if (!newProduct.name.trim()) return;
    const margin = parseFloat(newProduct.margin);
    if (!margin || margin <= 0) return;
    const id = newProduct.name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    setProducts((prev) => [...prev, { id, name: newProduct.name.trim(), unit: newProduct.unit, margin }]);
    setNewProduct({ name: "", unit: "kg", margin: "" });
    showToast("Product added.");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function fmt(n) {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
  }

  function getMotivation() {
    if (pct === 0) return {
      bg: "bg-gray-100 border border-gray-200",
      textColor: "text-gray-600",
      title: "No entries yet",
      msg: "Start logging collections and sales to track your performance.",
      barColor: "bg-gray-300",
    };
    if (pct < 30) return {
      bg: "bg-red-50 border border-red-200",
      textColor: "text-red-700",
      title: "You are far behind your salary target",
      msg: `You've covered only ${Math.round(pct)}% of your ₹${fmt(employee.salary)} salary. Pick up the pace — your job performance is being monitored.`,
      barColor: "bg-red-400",
    };
    if (pct < 60) return {
      bg: "bg-orange-50 border border-orange-200",
      textColor: "text-orange-700",
      title: "You're getting there — push harder",
      msg: `${Math.round(pct)}% covered. You need ₹${fmt(employee.salary - totalRevenue)} more to cover your Target cost. Don't slow down now.`,
      barColor: "bg-orange-400",
    };
    if (pct < 100) return {
      bg: "bg-amber-50 border border-amber-200",
      textColor: "text-amber-700",
      title: "Almost at your salary level",
      msg: `Just ₹${fmt(employee.salary - totalRevenue)} away from covering your full salary. Close a few more deals today.`,
      barColor: "bg-amber-400",
    };
    if (pct < 150) return {
      bg: "bg-green-50 border border-green-200",
      textColor: "text-green-700",
      title: "Salary covered — you are profitable",
      msg: `You've generated ₹${fmt(netResult)} in net profit for the company today. Good work.`,
      barColor: "bg-green-500",
    };
    return {
      bg: "bg-emerald-50 border border-emerald-200",
      textColor: "text-emerald-700",
      title: "Outstanding performance today",
      msg: `${Math.round(pct)}% of salary covered. You've generated ₹${fmt(netResult)} in net profit. You are among the top performers.`,
      barColor: "bg-emerald-500",
    };
  }

  const motivation = getMotivation();

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24 font-sans">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-xs text-gray-400 leading-none">Performance Ledger</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">{employee.name}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200 flex">
        {[{ key: "overview", label: "Overview" }, { key: "add", label: "Add Entry" }, { key: "products", label: "Products" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition ${tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="px-4 pt-4 space-y-3">

          {/* Result Banner */}
          <div className={`rounded-2xl p-5 ${isProfit ? "bg-gradient-to-br from-[#0A7C59] to-[#0D9E72]" : "bg-gradient-to-br from-[#C0392B] to-[#E74C3C]"} text-white`}>
            <p className="text-xs font-medium uppercase tracking-widest opacity-70 mb-1">
              {isProfit ? "Net Profit Generated" : "Net Loss"}
            </p>
            <p className="text-4xl font-bold tracking-tight">
              {isProfit ? "+" : "−"}₹{fmt(Math.abs(netResult))}
            </p>
            <p className="text-xs opacity-60 mt-1">After salary cost of ₹{fmt(dailySalaryCost)}/day</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs opacity-70 mb-1">
                <span>Revenue Coverage</span>
                <span>{totalRevenue > 0 ? Math.min(Math.round((totalRevenue / dailySalaryCost) * 100), 999) : 0}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((totalRevenue / dailySalaryCost) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Motivational Card */}
          <div className={`rounded-xl p-4 ${motivation.bg}`}>
            <p className={`text-sm font-semibold ${motivation.textColor} mb-1`}>{motivation.title}</p>
            <p className={`text-xs ${motivation.textColor} opacity-80 leading-relaxed`}>{motivation.msg}</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs opacity-60 mb-1">
                <span className={motivation.textColor}>₹{fmt(totalRevenue)} earned</span>
                <span className={motivation.textColor}>₹{fmt(employee.salary)} salary</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-white">
                <div className={`h-full rounded-full transition-all duration-700 ${motivation.barColor}`}
                  style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* 3 Stat Cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Collection", value: `₹${fmt(totalCollection)}`, sub: `${entries.filter((e) => e.type === "collection").length} entries`, color: "text-blue-600" },
              { label: "Sales Margin", value: `₹${fmt(salesRevenue)}`, sub: `${entries.filter((e) => e.type === "sale").length} entries`, color: "text-violet-600" },
              { label: "Daily Salary", value: `₹${fmt(dailySalaryCost)}`, sub: `₹${fmt(employee.salary)}/mo`, color: "text-orange-500" },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 mb-1">{card.label}</p>
                <p className={`text-sm font-bold ${card.color} leading-tight`}>{card.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Product Breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Sales Breakdown</p>
            </div>
            {salesBreakdown.filter((p) => p.totalQty > 0).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No sales entries yet.</p>
            ) : (
              salesBreakdown.filter((p) => p.totalQty > 0).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{fmt(p.totalQty)} {p.unit} · ₹{fmt(p.margin)}/{p.unit} margin</p>
                  </div>
                  <p className="text-sm font-semibold text-violet-600">+₹{fmt(p.revenue)}</p>
                </div>
              ))
            )}
          </div>

          {/* Collection Log */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Collection Log</p>
            </div>
            {entries.filter((e) => e.type === "collection").length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No collections yet.</p>
            ) : (
              entries.filter((e) => e.type === "collection").map((e, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-gray-700">{e.note}</p>
                  <p className="text-sm font-semibold text-blue-600">+₹{fmt(e.amount)}</p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ADD ENTRY TAB */}
      {tab === "add" && (
        <div className="px-4 pt-4 space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry Type</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ key: "collection", label: "Collection", desc: "Cash received from shop" }, { key: "sale", label: "Product Sale", desc: "Units sold, margin calculated" }].map((t) => (
                <button key={t.key} onClick={() => { setAddType(t.key); setFormError(""); }}
                  className={`text-left p-3 rounded-lg border-2 transition ${addType === t.key ? "border-blue-600 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
                  <p className={`text-sm font-semibold ${addType === t.key ? "text-blue-700" : "text-gray-700"}`}>{t.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
            {addType === "collection" ? (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Amount Collected (₹)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Shop / Note (optional)</label>
                  <input type="text" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Shop name or reference" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Product</label>
                  <select value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 bg-white">
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} — ₹{p.margin}/{p.unit}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">
                    Quantity ({products.find((p) => p.id === form.productId)?.unit || "unit"})
                  </label>
                  <input type="number" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
                    placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
                  {form.qty && form.productId && (
                    <p className="text-xs text-violet-600 mt-1">
                      Margin earned: ₹{fmt(parseFloat(form.qty || 0) * (products.find((p) => p.id === form.productId)?.margin || 0))}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Shop / Note (optional)</label>
                  <input type="text" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Shop name or reference" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
                </div>
              </>
            )}
            {formError && <p className="text-xs text-red-500">{formError}</p>}
            <button onClick={handleAddEntry} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold active:scale-95 transition">
              Save Entry
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <div className="px-4 pt-4 space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Margin Rates</p>
              <p className="text-[11px] text-gray-400">Tap to edit</p>
            </div>
            {products.map((p) => (
              <div key={p.id} className="px-4 py-3 border-b border-gray-50 last:border-0">
                {editingProduct?.id === p.id ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-gray-400">₹ per {p.unit}</span>
                      <input type="number" value={editingProduct.margin}
                        onChange={(e) => setEditingProduct((ep) => ({ ...ep, margin: e.target.value }))}
                        className="flex-1 border border-blue-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                      <button onClick={handleSaveMargin} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium">Save</button>
                      <button onClick={() => setEditingProduct(null)} className="text-gray-400 text-xs px-2 py-1.5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setEditingProduct({ ...p })}>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400">per {p.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-violet-600">₹{fmt(p.margin)}</p>
                      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.414-6.414a2 2 0 112.828 2.828L11.828 13.828A2 2 0 019 14H7v-2a2 2 0 01.586-1.414z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Add New Product</p>
            <input type="text" value={newProduct.name} onChange={(e) => setNewProduct((n) => ({ ...n, name: e.target.value }))}
              placeholder="Product name (e.g. Milk, Bread)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Unit</label>
                <select value={newProduct.unit} onChange={(e) => setNewProduct((n) => ({ ...n, unit: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500">
                  {["kg", "litre", "pack", "piece", "box", "dozen"].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Margin (₹ per unit)</label>
                <input type="number" value={newProduct.margin} onChange={(e) => setNewProduct((n) => ({ ...n, margin: e.target.value }))}
                  placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <button onClick={handleAddProduct} disabled={!newProduct.name.trim() || !newProduct.margin}
              className="w-full bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 active:scale-95 transition">
              Add Product
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
}