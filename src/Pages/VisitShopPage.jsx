// FILE: src/pages/VisitShopPage.jsx
// OWNER: Naveen
// CHANGES:
//   - shopType removed → replaced with fieldType (Field Sales / Collection)
//   - categories removed completely
//   - followUp section added with Yes/No + optional date picker

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext";

const FIELD_TYPES = ["Field Sales", "Collection"];

const FOLLOWUP_OPTIONS = [
  { value: "interested",     label: "Interested",        color: "green"  },
  { value: "callback",       label: "Call Back",          color: "blue"   },
  { value: "not_interested", label: "Not Interested",    color: "red"    },
  { value: "busy",           label: "Busy / Come Later", color: "amber"  },
  { value: "order_placed",   label: "Order Placed",      color: "purple" },
  { value: "payment_due",    label: "Payment Due",       color: "orange" },
];

// Returns true if the selected followup status needs a reminder date
function needsDate(status) {
  return ["interested", "callback", "payment_due", "busy"].includes(status);
}

export default function VisitShopPage() {
  const navigate = useNavigate();
  const { updateVisitForm } = useVisit();

  const [form, setForm] = useState({
    shopName:    "",
    shopCode:    "",
    ownerName:   "",
    mobile:      "",
    fieldType:   "",
    address:     "",
    // Follow-up
    followUpStatus: "",   // one of FOLLOWUP_OPTIONS values
    followUpDate:   "",   // optional date string YYYY-MM-DD
    followUpNeeded: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleFollowupStatus = (val) => {
    setForm((p) => ({
      ...p,
      followUpStatus: val,
      followUpNeeded: true,
      // Clear date if this status doesn't need one
      followUpDate: needsDate(val) ? p.followUpDate : "",
    }));
    if (errors.followUpStatus) setErrors((p) => ({ ...p, followUpStatus: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.shopName.trim())   e.shopName  = "Shop name is required";
    if (!form.shopCode.trim())   e.shopCode  = "Shop code is required";
    if (!form.ownerName.trim())  e.ownerName = "Owner name is required";
    if (!form.mobile.trim())     e.mobile    = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit number";
    if (!form.fieldType)         e.fieldType = "Select a field type";
    if (!form.address.trim())    e.address   = "Address is required";
    if (!form.followUpStatus)    e.followUpStatus = "Select a follow-up status";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    updateVisitForm({
      ...form,
      followUp: {
        needed: form.followUpNeeded,
        status: form.followUpStatus,
        date:   form.followUpDate || null,
      },
    });
    navigate("/prove-location");
  };

  // Tomorrow's date as min for follow-up date picker
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/dashboard")} className="p-1 rounded-full hover:bg-blue-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-base font-semibold">Visit Shop</h1>
          <p className="text-xs text-blue-200">Step 1 of 3 — Shop Information</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        <span className="ml-2 text-xs text-gray-400">Shop Info → Location → Photos</span>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── SHOP INFO ── */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Shop Information</p>

        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Shop Name <span className="text-red-500">*</span>
          </label>
          <input name="shopName" value={form.shopName} onChange={handleChange}
            placeholder="e.g. Annas Provision Store"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
              ${errors.shopName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.shopName && <p className="text-xs text-red-500 mt-1">{errors.shopName}</p>}
        </div>

        {/* Shop Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Shop Code <span className="text-red-500">*</span>
          </label>
          <input name="shopCode" value={form.shopCode} onChange={handleChange}
            placeholder="e.g. AP001"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
              ${errors.shopCode ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.shopCode && <p className="text-xs text-red-500 mt-1">{errors.shopCode}</p>}
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input name="ownerName" value={form.ownerName} onChange={handleChange}
            placeholder="e.g. Annas"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
              ${errors.ownerName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className={`flex items-stretch border rounded-2xl overflow-hidden bg-white
            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all
            ${errors.mobile ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
            <span className="flex items-center px-3.5 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 select-none">
              +91
            </span>
            <input name="mobile" type="tel" inputMode="numeric" value={form.mobile}
              onChange={handleChange} placeholder="98765 43210" maxLength={10}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm outline-none" />
          </div>
          {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
        </div>

        {/* Field Type — replaces old Shop Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {FIELD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => { setForm((p) => ({ ...p, fieldType: type })); if (errors.fieldType) setErrors((p) => ({ ...p, fieldType: "" })); }}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-semibold border-2 transition active:scale-95
                  ${form.fieldType === type
                    ? type === "Field Sales"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200"
                  }`}
              >
                {type === "Field Sales" ? " Field Sales" : " Collection"}
              </button>
            ))}
          </div>
          {errors.fieldType && <p className="text-xs text-red-500 mt-1">{errors.fieldType}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2}
            placeholder="123, Main Street, Chennai, Tamil Nadu"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none resize-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
              ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* ── FOLLOW-UP SECTION ── */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Follow-up Status <span className="text-red-500">*</span>
          </p>

          {/* Follow-up option chips */}
          <div className="grid grid-cols-2 gap-2">
            {FOLLOWUP_OPTIONS.map((opt) => {
              const selected = form.followUpStatus === opt.value;
              const colorMap = {
                green:  selected ? "bg-green-500 text-white border-green-500"  : "bg-white text-gray-700 border-gray-200",
                blue:   selected ? "bg-blue-500 text-white border-blue-500"    : "bg-white text-gray-700 border-gray-200",
                red:    selected ? "bg-red-500 text-white border-red-500"      : "bg-white text-gray-700 border-gray-200",
                amber:  selected ? "bg-amber-500 text-white border-amber-500"  : "bg-white text-gray-700 border-gray-200",
                purple: selected ? "bg-purple-500 text-white border-purple-500": "bg-white text-gray-700 border-gray-200",
                orange: selected ? "bg-orange-500 text-white border-orange-500": "bg-white text-gray-700 border-gray-200",
              };
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFollowupStatus(opt.value)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-2xl border text-sm font-medium transition active:scale-95 ${colorMap[opt.color]}`}
                >
                  <span className="text-base">{opt.emoji}</span>
                  <span className="text-left leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {errors.followUpStatus && (
            <p className="text-xs text-red-500 mt-2">{errors.followUpStatus}</p>
          )}

          {/* Follow-up date — only shows if status needs a date */}
          {form.followUpStatus && needsDate(form.followUpStatus) && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                {/* <span className="text-base">📅</span> */}
                <p className="text-sm font-semibold text-blue-800">Set Follow-up Reminder</p>
                <span className="ml-auto text-[10px] text-blue-400 font-medium">Optional</span>
              </div>

              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
                min={tomorrow}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm bg-white outline-none
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />

              {form.followUpDate && (
                <div className="flex items-center gap-2 mt-2.5">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <p className="text-xs text-green-700 font-medium">
                    You'll be reminded on{" "}
                    {new Date(form.followUpDate).toLocaleDateString("en-IN", {
                      weekday: "long", day: "numeric", month: "long"
                    })}
                  </p>
                </div>
              )}

              {/* Skip date option */}
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, followUpDate: "" }))}
                className="mt-2 text-xs text-gray-400 underline"
              >
                Skip reminder date
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base transition-all shadow-md shadow-blue-200"
        >
          Save & Continue →
        </button>
      </div>

    </div>
  );
}