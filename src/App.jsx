import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VisitProvider } from './context/VisitContext';
import VisitShopPage from './pages/VisitShopPage';
import ProveLocationPage from './pages/ProveLocationPage';
import UploadPhotosPage from './pages/UploadPhotosPage';
import VisitSummaryPage from './pages/VisitSummaryPage';
import MyVisitsPage from './pages/MyVisitsPage';
import VisitDetailPage from './pages/VisitDetailPage';
import DashboardPage from './pages/DashboardPage';
import BottomNav from './components/BottomNav';
import ProfilePage from './pages/ProfilePage';
import DailyTargetPage from './pages/DailyTargetPage';


export default function App() {
  return (
    <BrowserRouter>
      <VisitProvider>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/visit-shop" element={<VisitShopPage />} />
          <Route path="/prove-location" element={<ProveLocationPage />} />
          <Route path="/upload-photos" element={<UploadPhotosPage />} />
          <Route path="/visit-summary" element={<VisitSummaryPage />} />
          <Route path="/my-visits" element={<MyVisitsPage />} />
          <Route path="/visit-detail/:id" element={<VisitDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/daily-target" element={<DailyTargetPage />} />
        </Routes>
        <BottomNav />
      </VisitProvider>
    </BrowserRouter>
  );
}
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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