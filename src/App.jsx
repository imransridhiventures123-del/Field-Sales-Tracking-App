import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VisitProvider } from "./context/VisitContext";
import PrivateRoute from "./components/PrivateRoute";
import BottomNav from "./components/BottomNav";

import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPage";
import DashboardPage  from "./pages/DashboardPage";
import DailyTargetPage from "./pages/DailyTargetPage";
import ProfilePage    from "./pages/ProfilePage";
import VisitShopPage  from "./pages/VisitShopPage";
import ProveLocationPage from "./pages/ProveLocationPage";
import UploadPhotosPage  from "./pages/UploadPhotosPage";
import VisitSummaryPage  from "./pages/VisitSummaryPage";
import MyVisitsPage      from "./pages/MyVisitsPage";
import VisitDetailPage   from "./pages/VisitDetailPage";
import FollowUpPage from "./pages/FollowUpPage";
import PerformanceLedger from "./pages/PerformanceLedger";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VisitProvider>
          <Routes>
            <Route path="/"         element={<Navigate to="/login" replace />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/daily-target" element={<PrivateRoute><DailyTargetPage /></PrivateRoute>} />
            <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/visit-shop"      element={<PrivateRoute><VisitShopPage /></PrivateRoute>} />
            <Route path="/prove-location"  element={<PrivateRoute><ProveLocationPage /></PrivateRoute>} />
            <Route path="/upload-photos"   element={<PrivateRoute><UploadPhotosPage /></PrivateRoute>} />
            <Route path="/visit-summary"   element={<PrivateRoute><VisitSummaryPage /></PrivateRoute>} />
            <Route path="/my-visits"       element={<PrivateRoute><MyVisitsPage /></PrivateRoute>} />
            <Route path="/visit-detail/:id" element={<PrivateRoute><VisitDetailPage /></PrivateRoute>} />
            <Route path="/performance" element={<PerformanceLedger />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/followups" element={<FollowUpPage />} />
          </Routes>
          <BottomNav />
        </VisitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}