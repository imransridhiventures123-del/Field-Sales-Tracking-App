// ============================================================
//  FILE: src/pages/LoginPage.jsx
//  OWNER: Imran
//  STYLE: 100% Tailwind CSS
//  NOTE: Uses fake login for now so you can test UI immediately.
//        Replace the fake block with real API call later.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Uncomment when useAuth and authApi are ready:
// import { useAuth } from "../context/AuthContext";
// import { loginUser } from "../api/authApi";

export default function LoginPage() {

  const [mobile, setMobile]             = useState("");
  const [password, setPassword]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  // const { login } = useAuth();  ← uncomment when ready

  // ── VALIDATION ──────────────────────────────────────────
  const validate = () => {
    if (!mobile.trim()) {
      setError("Please enter your mobile number.");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return false;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  // ── LOGIN HANDLER ───────────────────────────────────────
  const handleLogin = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      // ── FAKE LOGIN (remove this when backend is ready) ──
      await new Promise((r) => setTimeout(r, 1000));
      navigate("/visit-shop"); // temp: go to Naveen's page to test it
      // ── END FAKE ──

      // ── REAL LOGIN (uncomment when ready) ──
      // const response = await loginUser(mobile, password);
      // login(response.token, response.user);
      // navigate("/dashboard");

    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500 opacity-[0.06] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-blue-300 opacity-[0.07] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-[28px] shadow-xl shadow-blue-100/60 px-8 py-9 relative z-10">

        {/* Logo + brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
            <span className="text-white text-xl font-bold tracking-tight">M</span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-gray-900 leading-tight">Field-sales-pro</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Field Sales & Distribution</p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-gray-900 mb-1">Welcome Back!</h1>
        <p className="text-sm text-gray-400 mb-6">Login to continue</p>

        {/* Error box */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-5">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Mobile number */}
        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number
          </label>
          <div className="flex items-stretch border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/70 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
            <span className="flex items-center px-3.5 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 select-none font-medium">
              +91
            </span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={mobile}
              maxLength={10}
              onChange={(e) => { setMobile(e.target.value); if (error) setError(""); }}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="flex items-stretch border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/70 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="px-4 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => alert("Contact your admin to reset password.")}
            className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-2xl transition-all duration-150 mb-5 flex items-center justify-center gap-2 shadow-md shadow-blue-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Logging in...
            </>
          ) : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 whitespace-nowrap">or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Google button */}
        <button
          type="button"
          className="w-full py-3.5 border border-gray-200 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}