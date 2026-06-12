// ============================================================
//  FILE: src/components/PrivateRoute.jsx
//  OWNER: Imran
//  PURPOSE: Protects pages that need login.
//           If user is not logged in → redirect to /login
//           If user is logged in → show the page normally
//
//  USAGE in App.jsx:
//  <Route path="/dashboard" element={
//    <PrivateRoute><DashboardPage /></PrivateRoute>
//  }/>
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();

  // If no token exists → user is not logged in → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists → user is logged in → show the requested page
  return children;
}