// ============================================================
//  FILE: src/context/AuthContext.jsx
//  OWNER: Imran
//  PURPOSE: Stores logged-in user info globally.
//           Every page can read the user and token from here.
// ============================================================

import { createContext, useContext, useState } from "react";

// Step 1: Create the context object
const AuthContext = createContext();

// Step 2: Create the Provider component
// Wrap your entire app in this so all pages can access user/token
export function AuthProvider({ children }) {

  // Try to load existing user from localStorage
  // so the user stays logged in after page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("maavu_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("maavu_token") || null;
  });

  // Call this after successful login API response
  const login = (newToken, newUser) => {
    localStorage.setItem("maavu_token", newToken);
    localStorage.setItem("maavu_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Call this when user taps Logout
  const logout = () => {
    localStorage.removeItem("maavu_token");
    localStorage.removeItem("maavu_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Export a custom hook so pages can easily use the context
// Usage in any page:  const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}