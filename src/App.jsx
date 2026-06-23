import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VisitProvider }    from "./context/VisitContext";
import { LocationProvider } from "./context/LocationContext";
import PrivateRoute      from "./components/PrivateRoute";
import BottomNav         from "./components/BottomNav";

// ── IMRAN'S PAGES ──
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";
import DashboardPage     from "./pages/DashboardPage";
import DailyTargetPage   from "./pages/DailyTargetPage";
import ProfilePage       from "./pages/ProfilePage";
import EndOfDayPage      from "./pages/EndOfDayPage";

// ── NAVEEN'S PAGES ──
import VisitShopPage      from "./pages/VisitShopPage";
import ProveLocationPage  from "./pages/ProveLocationPage";
import UploadPhotosPage   from "./pages/UploadPhotosPage";
import VisitSummaryPage   from "./pages/VisitSummaryPage";
import MyVisitsPage       from "./pages/MyVisitsPage";
import VisitDetailPage    from "./pages/VisitDetailPage";
import FollowUpPage       from "./pages/FollowUpPage";
import PerformanceLedger  from "./pages/PerformanceLedger";

// ── ROOT REDIRECT ──────────────────────────────────────────────────
// CHANGE: Previously "/" always went to "/login" (no token check).
// So every time the PWA opened it showed login — even if token was
// sitting in localStorage.
// Now: token hai → dashboard, nahi hai → login.
// Yahi tha asli masla.
function RootRedirect() {
  const { token } = useAuth();
  return token
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login"    replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <VisitProvider>
            <Routes>

              {/* Root — token check karo */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Imran's pages */}
              <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/daily-target" element={<PrivateRoute><DailyTargetPage /></PrivateRoute>} />
              <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/end-of-day"   element={<PrivateRoute><EndOfDayPage /></PrivateRoute>} />

              {/* Naveen's visit flow */}
              <Route path="/visit-shop"       element={<PrivateRoute><VisitShopPage /></PrivateRoute>} />
              <Route path="/prove-location"   element={<PrivateRoute><ProveLocationPage /></PrivateRoute>} />
              <Route path="/upload-photos"    element={<PrivateRoute><UploadPhotosPage /></PrivateRoute>} />
              <Route path="/visit-summary"    element={<PrivateRoute><VisitSummaryPage /></PrivateRoute>} />
              <Route path="/my-visits"        element={<PrivateRoute><MyVisitsPage /></PrivateRoute>} />
              <Route path="/visit-detail/:id" element={<PrivateRoute><VisitDetailPage /></PrivateRoute>} />

              {/* Naveen's new pages */}
              <Route path="/followups"   element={<PrivateRoute><FollowUpPage /></PrivateRoute>} />
              <Route path="/performance" element={<PrivateRoute><PerformanceLedger /></PrivateRoute>} />

              {/* 404 — token check karo */}
              <Route path="*" element={<RootRedirect />} />

            </Routes>
            <BottomNav />
          </VisitProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}