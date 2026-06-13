import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VisitProvider } from "./context/VisitContext";
import LoginPage from "./pages/LoginPage";
import VisitShopPage from "./pages/VisitShopPage";
import ProveLocationPage from "./pages/ProveLocationPage";
import UploadPhotosPage from "./pages/UploadPhotosPage";
import VisitSummaryPage from "./pages/VisitSummaryPage";
import MyVisitsPage from "./pages/MyVisitsPage";
import VisitDetailPage from "./pages/VisitDetailPage";
import DashboardPage from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VisitProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* TEMPORARY: PrivateRoute removed for testing - add it back later */}
            <Route path="/visit-shop" element={<VisitShopPage />} />
            <Route path="/prove-location" element={<ProveLocationPage />} />
            <Route path="/upload-photos" element={<UploadPhotosPage />} />
            <Route path="/visit-summary" element={<VisitSummaryPage />} />
            <Route path="/my-visits" element={<MyVisitsPage />} />
            <Route path="/visit-detail/:id" element={<VisitDetailPage />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </VisitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}