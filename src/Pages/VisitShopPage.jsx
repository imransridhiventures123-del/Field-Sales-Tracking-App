import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext";

const CATEGORIES = ["Grocery", "Provisions", "Beverages", "Medical", "Others"];
const VISIT_TYPES = ["Field Sales", "Collection"];

export default function VisitShopPage() {
  const navigate = useNavigate();
  const { updateVisitForm } = useVisit();
  const user = null; // temporary until Imran builds AuthContext

  const [form, setForm] = useState({
    shopName: "",
    shopCode: "",
    ownerName: "",
    mobile: "",
    shopType: "",
    address: "",
    categories: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryToggle = (category) => {
    setForm((prev) => {
      const already = prev.categories.includes(category);
      return {
        ...prev,
        categories: already
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.shopName.trim())
      newErrors.shopName = "Shop name is required";

    if (!form.shopCode.trim())
      newErrors.shopCode = "Shop code is required";

    if (!form.ownerName.trim())
      newErrors.ownerName = "Owner name is required";

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!form.shopType)
      newErrors.shopType = "Please select a shop type";

    if (!form.address.trim())
      newErrors.address = "Address is required";

    if (form.categories.length === 0)
      newErrors.categories = "Select at least one category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);

    updateVisitForm({
      shopName: form.shopName,
      shopCode: form.shopCode,
      ownerName: form.ownerName,
      mobile: form.mobile,
      shopType: form.shopType,
      address: form.address,
      categories: form.categories,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/prove-location");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-blue-500 transition"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-semibold">Visit Shop</h1>
          <p className="text-xs text-blue-200">Step 1 of 3 — Shop Information</p>
        </div>
      </div>

      {/* STEP PROGRESS */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        <span className="ml-2 text-xs text-gray-400">Shop Info → Location → Photos</span>
      </div>

      {/* FORM */}
      <div className="px-4 pt-4 space-y-4">

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Shop Information
        </p>

        {/* SHOP NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Visit Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            placeholder="e.g. Annas Provision Store"
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.shopName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.shopName && (
            <p className="text-xs text-red-500 mt-1">{errors.shopName}</p>
          )}
        </div>

        {/* SHOP CODE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="shopCode"
            value={form.shopCode}
            onChange={handleChange}
            placeholder="e.g. AP001"
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.shopCode ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.shopCode && (
            <p className="text-xs text-red-500 mt-1">{errors.shopCode}</p>
          )}
        </div>

        {/* OWNER NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="e.g. Annas"
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.ownerName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.ownerName && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>
          )}
        </div>

        {/* MOBILE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex items-center px-3 py-3 bg-gray-100 rounded-xl border border-gray-200 text-sm text-gray-500 select-none">
              +91
            </div>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="98765 43210"
              maxLength={10}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                ${errors.mobile ? "border-red-400 bg-red-50" : "border-gray-200"}`}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* SHOP TYPE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Type <span className="text-red-500">*</span>
          </label>
          <select
            name="shopType"
            value={form.shopType}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.shopType ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select visit type</option>
            {VISIT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.shopType && (
            <p className="text-xs text-red-500 mt-1">{errors.shopType}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123, Main Street, Chennai, Tamil Nadu 600001"
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none
              ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        {/* CATEGORIES */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = form.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition
                    ${isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          {errors.categories && (
            <p className="text-xs text-red-500 mt-1">{errors.categories}</p>
          )}
        </div>

      </div>

      {/* SUBMIT BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl text-white font-semibold text-base transition
            ${isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
        >
          {isSubmitting ? "Saving..." : "Save & Continue →"}
        </button>
      </div>

    </div>
  );
}