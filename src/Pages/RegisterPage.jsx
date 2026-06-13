// ============================================================
//  FILE: src/pages/RegisterPage.jsx
//  OWNER: Imran
//  PURPOSE: New employee registration — 4-step onboarding form
//
//  STEPS:
//   Step 1 — Personal Info  (name, DOB, phone, address)
//   Step 2 — Identity Docs  (Aadhaar, PAN)
//   Step 3 — Work Info      (salary, photo)
//   Step 4 — Set Password + confirm
//
//  DUMMY MODE: saves to localStorage, no backend needed yet.
//  SWITCH TO REAL: uncomment registerUser() call in handleFinish()
//
//  ADD ROUTE in App.jsx:
//    import RegisterPage from "./pages/RegisterPage";
//    <Route path="/register" element={<RegisterPage />} />
// ============================================================

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── STEP CONFIG ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Personal",  icon: "👤" },
  { id: 2, label: "Identity",  icon: "🪪" },
  { id: 3, label: "Work",      icon: "💼" },
  { id: 4, label: "Security",  icon: "🔒" },
];

// ── HELPERS ─────────────────────────────────────────────────
function getAgeFromDOB(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function generateEmployeeId(name, dob) {
  if (!name || !dob) return "";
  const initials = name.trim().split(" ").map((n) => n[0].toUpperCase()).join("");
  const year = new Date(dob).getFullYear().toString().slice(-2);
  const rand = Math.floor(100 + Math.random() * 900);
  return `EMP${initials}${year}${rand}`;
}

// ── REUSABLE INPUT ───────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        {error}
      </p>}
    </div>
  );
}

function TextInput({ name, value, onChange, placeholder, type = "text", maxLength, inputMode, error }) {
  return (
    <input
      name={name}
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      onChange={onChange}
      className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
        focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300
        ${error ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
    />
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function RegisterPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const photoRef  = useRef();

  const [step, setStep]       = useState(1);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    // Step 1 — Personal
    fullName:  "",
    phone:     "",
    dob:       "",
    address:   "",
    city:      "",
    pincode:   "",
    // Step 2 — Identity
    aadhaar:   "",
    pan:       "",
    // Step 3 — Work
    salary:    "",
    photo:     null,
    // Step 4 — Security
    password:  "",
    confirmPassword: "",
  });

  const set = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const age = getAgeFromDOB(form.dob);

  // ── VALIDATION PER STEP ─────────────────────────────────
  const validate = () => {
    const e = {};

    if (step === 1) {
      if (!form.fullName.trim())   e.fullName = "Full name is required";
      else if (form.fullName.trim().split(" ").length < 2) e.fullName = "Enter first and last name";
      if (!form.phone.trim())      e.phone = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
      if (!form.dob)               e.dob = "Date of birth is required";
      else if (age < 18)           e.dob = "Must be at least 18 years old";
      else if (age > 60)           e.dob = "Age must be under 60";
      if (!form.address.trim())    e.address = "Address is required";
      if (!form.city.trim())       e.city = "City is required";
      if (!form.pincode.trim())    e.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    }

    if (step === 2) {
      if (!form.aadhaar.trim())    e.aadhaar = "Aadhaar number is required";
      else if (!/^\d{12}$/.test(form.aadhaar.replace(/\s/g, ""))) e.aadhaar = "Enter valid 12-digit Aadhaar number";
      if (!form.pan.trim())        e.pan = "PAN number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) e.pan = "Enter valid PAN (e.g. ABCDE1234F)";
    }

    if (step === 3) {
      if (!form.salary.trim())     e.salary = "Salary is required";
      else if (isNaN(form.salary) || Number(form.salary) < 1000) e.salary = "Enter valid salary amount";
      if (!form.photo)             e.photo = "Profile photo is required";
    }

    if (step === 4) {
      if (!form.password)          e.password = "Password is required";
      else if (form.password.length < 6) e.password = "Minimum 6 characters";
      if (!form.confirmPassword)   e.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validate()) setStep((s) => s + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  // ── FINISH ──────────────────────────────────────────────
  const handleFinish = async () => {
    if (!validate()) return;
    setLoading(true);

    const employeeId = generateEmployeeId(form.fullName, form.dob);

    // DUMMY — saves to localStorage so dashboard can read it
    const newUser = {
      _id:        Date.now().toString(),
      name:       form.fullName,
      mobile:     form.phone,
      dob:        form.dob,
      age:        age,
      address:    `${form.address}, ${form.city} - ${form.pincode}`,
      aadhaar:    form.aadhaar,
      pan:        form.pan.toUpperCase(),
      salary:     form.salary,
      photo:      photoPreview,
      employeeId: employeeId,
      role:       "employee",
      joinedAt:   new Date().toISOString(),
    };

    await new Promise((r) => setTimeout(r, 1200));

    // Save to localStorage so it persists
    const dummyToken = `dummy-token-${newUser._id}`;
    login(dummyToken, newUser);

    setLoading(false);
    navigate("/dashboard");

    // ── REAL API: uncomment when backend ready ──
    // const response = await registerUser(form);
    // login(response.token, response.user);
    // navigate("/dashboard");
  };

  // ── FORMAT AADHAAR with spaces (XXXX XXXX XXXX) ─────────
  const handleAadhaar = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm((p) => ({ ...p, aadhaar: formatted }));
    if (errors.aadhaar) setErrors((p) => ({ ...p, aadhaar: "" }));
  };

  // ── PHOTO HANDLER ───────────────────────────────────────
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setForm((p) => ({ ...p, photo: file }));
      if (errors.photo) setErrors((p) => ({ ...p, photo: "" }));
    };
    reader.readAsDataURL(file);
  };

  // ── STEP PANELS ─────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // ═══════════════════════════════════
      case 1: return (
        <div className="space-y-4">
          <Field label="Full Name" required error={errors.fullName}>
            <TextInput name="fullName" value={form.fullName} onChange={set}
              placeholder="e.g. Rakesh Kumar" error={errors.fullName} />
          </Field>

          <Field label="Mobile Number" required error={errors.phone}>
            <div className={`flex items-stretch border rounded-2xl overflow-hidden bg-white
              focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all
              ${errors.phone ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}>
              <span className="flex items-center px-3.5 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 select-none font-medium">
                +91
              </span>
              <input name="phone" type="tel" inputMode="numeric" placeholder="98765 43210"
                value={form.phone} maxLength={10} onChange={set}
                className="flex-1 bg-transparent px-4 py-3.5 text-sm outline-none" />
            </div>
          </Field>

          <Field label="Date of Birth" required error={errors.dob}>
            <input name="dob" type="date" value={form.dob} onChange={set}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString().split("T")[0]}
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${errors.dob ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
            />
            {age && age >= 18 && (
              <p className="text-xs text-blue-500 mt-1.5">
                ✓ Age {age} years — Employee ID will be auto-generated from your DOB
              </p>
            )}
          </Field>

          <Field label="Address" required error={errors.address}>
            <textarea name="address" value={form.address} onChange={set} rows={2}
              placeholder="Door no., Street, Area"
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none resize-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${errors.address ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City" required error={errors.city}>
              <TextInput name="city" value={form.city} onChange={set}
                placeholder="Chennai" error={errors.city} />
            </Field>
            <Field label="Pincode" required error={errors.pincode}>
              <TextInput name="pincode" value={form.pincode} onChange={set}
                placeholder="600001" maxLength={6} inputMode="numeric" error={errors.pincode} />
            </Field>
          </div>
        </div>
      );

      // ═══════════════════════════════════
      case 2: return (
        <div className="space-y-5">

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex gap-3">
            <span className="text-lg flex-shrink-0">🔐</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your identity documents are encrypted and stored securely.
              They are only used for employee verification purposes.
            </p>
          </div>

          <Field label="Aadhaar Number" required error={errors.aadhaar}>
            <input value={form.aadhaar} onChange={handleAadhaar}
              placeholder="XXXX XXXX XXXX" inputMode="numeric" maxLength={14}
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none font-mono
                tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${errors.aadhaar ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
            />
            <p className="text-xs text-gray-400 mt-1.5">12-digit number on your Aadhaar card</p>
          </Field>

          <Field label="PAN Number" required error={errors.pan}>
            <input name="pan" value={form.pan.toUpperCase()} onChange={set}
              placeholder="ABCDE1234F" maxLength={10}
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none font-mono
                tracking-widest uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${errors.pan ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
            />
            <p className="text-xs text-gray-400 mt-1.5">10-character PAN card number</p>
          </Field>

          {/* Visual ID preview */}
          {form.fullName && form.dob && (
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 text-white">
              <p className="text-xs text-blue-300 mb-3 font-medium uppercase tracking-wider">
                Employee ID Preview
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-sm font-bold">
                  {form.fullName.trim().split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{form.fullName}</p>
                  <p className="text-blue-200 text-xs font-mono">
                    {generateEmployeeId(form.fullName, form.dob)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );

      // ═══════════════════════════════════
      case 3: return (
        <div className="space-y-5">

          {/* Profile Photo */}
          <Field label="Profile Photo" required error={errors.photo}>
            <div className="flex flex-col items-center gap-4">
              {/* Photo preview or placeholder */}
              <div
                onClick={() => photoRef.current.click()}
                className={`relative w-28 h-28 rounded-full border-4 cursor-pointer overflow-hidden
                  flex items-center justify-center transition-all active:scale-95
                  ${photoPreview
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-dashed border-gray-300 bg-gray-50"
                  }`}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    {/* Edit overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span className="text-[10px] text-gray-400">Add photo</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => photoRef.current.click()}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-full border border-blue-200 active:scale-95 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {photoPreview ? "Change Photo" : "Take / Upload Photo"}
              </button>

              <input ref={photoRef} type="file" accept="image/*" capture="user"
                className="hidden" onChange={handlePhoto} />

              <p className="text-xs text-gray-400 text-center">
                Use a clear, front-facing photo.<br/>This will appear on your profile and dashboard.
              </p>
            </div>
          </Field>

          {/* Salary */}
          <Field label="Monthly Salary (₹)" required error={errors.salary}>
            <div className={`flex items-stretch border rounded-2xl overflow-hidden bg-white
              focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all
              ${errors.salary ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}>
              <span className="flex items-center px-3.5 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 select-none font-semibold">
                ₹
              </span>
              <input name="salary" type="number" inputMode="numeric"
                value={form.salary} onChange={set} placeholder="25000"
                className="flex-1 bg-transparent px-4 py-3.5 text-sm outline-none" />
            </div>
            {form.salary && !isNaN(form.salary) && Number(form.salary) >= 1000 && (
              <p className="text-xs text-green-600 mt-1.5">
                ✓ ₹{Number(form.salary).toLocaleString("en-IN")} per month
              </p>
            )}
          </Field>

        </div>
      );

      // ═══════════════════════════════════
      case 4: return (
        <div className="space-y-5">

          {/* Summary card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 flex items-center gap-4">
            {photoPreview ? (
              <img src={photoPreview} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white/30 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {form.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
            <div>
              <p className="text-white font-semibold">{form.fullName}</p>
              <p className="text-blue-200 text-xs">{form.phone}</p>
              <p className="text-blue-200 text-xs font-mono mt-0.5">
                {generateEmployeeId(form.fullName, form.dob)}
              </p>
            </div>
          </div>

          <Field label="Set Password" required error={errors.password}>
            <input name="password" type="password" value={form.password} onChange={set}
              placeholder="Minimum 6 characters"
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${errors.password ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
            />
            {/* Password strength bar */}
            {form.password && (
              <div className="mt-2 flex gap-1">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                    form.password.length >= i * 3
                      ? i <= 1 ? "bg-rose-400"
                        : i <= 2 ? "bg-amber-400"
                        : i <= 3 ? "bg-blue-400"
                        : "bg-green-500"
                      : "bg-gray-100"
                  }`} />
                ))}
                <span className="text-xs text-gray-400 ml-1">
                  {form.password.length < 4 ? "Weak" : form.password.length < 7 ? "Fair" : form.password.length < 10 ? "Good" : "Strong"}
                </span>
              </div>
            )}
          </Field>

          <Field label="Confirm Password" required error={errors.confirmPassword}>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={set}
              placeholder="Re-enter your password"
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm bg-white outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${errors.confirmPassword ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
            />
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p className="text-xs text-green-600 mt-1.5">✓ Passwords match</p>
            )}
          </Field>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <span className="text-blue-600 underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-blue-600 underline">Privacy Policy</span>
          </p>
        </div>
      );

      default: return null;
    }
  };

  // ── RENDER ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white pb-10">

      {/* ── TOP HEADER ── */}
      <div className="bg-blue-600 px-4 pt-12 pb-6">
        <button
          onClick={() => step > 1 ? prevStep() : navigate("/login")}
          className="flex items-center gap-2 text-blue-200 text-sm mb-4 active:opacity-70 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          {step > 1 ? "Back" : "Login"}
        </button>

        <h1 className="text-white text-2xl font-bold mb-0.5">Create Account</h1>
        <p className="text-blue-200 text-sm">Join Maavu Sales Pro</p>
      </div>

      {/* ── STEP INDICATOR ── */}
      <div className="px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              {/* Step dot */}
              <div className={`flex flex-col items-center gap-1`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all
                  ${step > s.id
                    ? "bg-green-500 shadow-md shadow-green-200"
                    : step === s.id
                    ? "bg-blue-600 shadow-md shadow-blue-200"
                    : "bg-gray-100"
                  }`}>
                  {step > s.id ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : (
                    <span className={step === s.id ? "grayscale-0" : "grayscale opacity-40"}>
                      {s.icon}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${
                  step === s.id ? "text-blue-600" : step > s.id ? "text-green-500" : "text-gray-300"
                }`}>{s.label}</span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 mb-4 rounded-full transition-all ${
                  step > s.id ? "bg-green-400" : "bg-gray-100"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="px-4 pt-5 max-w-sm mx-auto">

        {/* Step label */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl">{STEPS[step - 1].icon}</span>
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
              Step {step} of {STEPS.length}
            </p>
            <h2 className="text-base font-bold text-gray-900">
              {step === 1 && "Personal Information"}
              {step === 2 && "Identity Documents"}
              {step === 3 && "Work Details"}
              {step === 4 && "Set Your Password"}
            </h2>
          </div>
        </div>

        {/* Form fields */}
        {renderStep()}

        {/* ── NAVIGATION BUTTONS ── */}
        <div className="mt-8 space-y-3">
          {step < STEPS.length ? (
            <button
              onClick={nextStep}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base rounded-2xl transition-all shadow-md shadow-blue-200"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold text-base rounded-2xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating your account...
                </>
              ) : "🎉 Create Account"}
            </button>
          )}

          {step > 1 && (
            <button
              onClick={prevStep}
              className="w-full py-3.5 text-gray-500 text-sm font-medium active:opacity-60 transition"
            >
              ← Back to {STEPS[step - 2].label}
            </button>
          )}
        </div>

        {/* Sign in link */}
        {step === 1 && (
          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Sign In
            </button>
          </p>
        )}

      </div>
    </div>
  );
}