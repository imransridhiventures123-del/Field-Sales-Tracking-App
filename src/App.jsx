import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VisitProvider } from './context/VisitContext';
import VisitShopPage from './pages/VisitShopPage';
import ProveLocationPage from './pages/ProveLocationPage';
import UploadPhotosPage from './pages/UploadPhotosPage';
import VisitSummaryPage from './pages/VisitSummaryPage';
import MyVisitsPage from './pages/MyVisitsPage';
import VisitDetailPage from './pages/VisitDetailPage';
export default function App() {
  return (
    <BrowserRouter>
      <VisitProvider>
        <Routes>
          <Route path="/" element={<VisitShopPage />} />
          <Route path="/visit-shop" element={<VisitShopPage />} />
          <Route path="/prove-location" element={<ProveLocationPage />} />
          <Route path="/upload-photos" element={<UploadPhotosPage />} />
          <Route path="/visit-summary" element={<VisitSummaryPage />} />
          <Route path="/my-visits" element={<MyVisitsPage />} />
          <Route path="/visit-detail/:id" element={<VisitDetailPage />} />
        </Routes>
      </VisitProvider>
    </BrowserRouter>
  );
}