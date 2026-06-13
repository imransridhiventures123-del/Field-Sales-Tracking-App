import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VisitProvider } from "./context/VisitContext";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import LoginPage        from "./pages/LoginPage";
import DashboardPage    from "./pages/DashboardPage";
import DailyTargetPage  from "./pages/DailyTargetPage";
import ProfilePage      from "./pages/ProfilePage";
import VisitShopPage    from "./pages/VisitShopPage";
import ProveLocationPage  from "./pages/ProveLocationPage";
import UploadPhotosPage   from "./pages/UploadPhotosPage";
import VisitSummaryPage   from "./pages/VisitSummaryPage";
import MyVisitsPage       from "./pages/MyVisitsPage";
import VisitDetailPage    from "./pages/VisitDetailPage";

// Shared UI
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VisitProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Imran's pages */}
            <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/daily-target" element={<PrivateRoute><DailyTargetPage /></PrivateRoute>} />
            <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            {/* Naveen's pages */}
            <Route path="/visit-shop"      element={<PrivateRoute><VisitShopPage /></PrivateRoute>} />
            <Route path="/prove-location"  element={<PrivateRoute><ProveLocationPage /></PrivateRoute>} />
            <Route path="/upload-photos"   element={<PrivateRoute><UploadPhotosPage /></PrivateRoute>} />
            <Route path="/visit-summary"   element={<PrivateRoute><VisitSummaryPage /></PrivateRoute>} />
            <Route path="/my-visits"       element={<PrivateRoute><MyVisitsPage /></PrivateRoute>} />
            <Route path="/visit-detail/:id" element={<PrivateRoute><VisitDetailPage /></PrivateRoute>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* BottomNav shows on all private pages */}
          <BottomNav />
        </VisitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}