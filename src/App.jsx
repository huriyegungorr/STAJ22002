import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PosProvider } from './context/PosContext';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import AnaSayfa from './pages/AnaSayfa';
import MasalarSayfasi from './pages/MasalarSayfasi';
import SiparisSayfasi from './pages/SiparisSayfasi';
import MenuSayfasi from './pages/MenuSayfasi';
import RezervasyonSayfasi from './pages/RezervasyonSayfasi';
import MutfakEkrani from './pages/MutfakEkrani';
import AyarlarSayfasi from './pages/AyarlarSayfasi';
import QrMenuSayfasi from './pages/QrMenuSayfasi';
import IstatistikSayfasi from './pages/IstatistikSayfasi';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      
        <Route path="/qr-menu/:masaId" element={<QrMenuSayfasi />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <PosProvider>
      <Routes>
    
        <Route path="/qr-menu/:masaId" element={<QrMenuSayfasi />} />

       
        <Route element={<MainLayout />}>
          
        
          <Route
            path="/"
            element={
              <ProtectedRoute izinVerilenRoller={['admin', 'garson', 'mutfak']}>
                <AnaSayfa />
              </ProtectedRoute>
            }
          />

        
          <Route
            path="/masalar"
            element={
              <ProtectedRoute izinVerilenRoller={['admin', 'garson']}>
                <MasalarSayfasi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/siparis/:id"
            element={
              <ProtectedRoute izinVerilenRoller={['admin', 'garson']}>
                <SiparisSayfasi />
              </ProtectedRoute>
            }
          />

        
          <Route
            path="/menu"
            element={
              <ProtectedRoute izinVerilenRoller={['admin']}>
                <MenuSayfasi />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rezervasyon"
            element={
              <ProtectedRoute izinVerilenRoller={['admin', 'garson']}>
                <RezervasyonSayfasi />
              </ProtectedRoute>
            }
          />


          <Route
            path="/mutfak"
            element={
              <ProtectedRoute izinVerilenRoller={['admin', 'mutfak', 'garson']}>
                <MutfakEkrani />
              </ProtectedRoute>
            }
          />


          <Route
            path="/ayarlar"
            element={
              <ProtectedRoute izinVerilenRoller={['admin']}>
                <AyarlarSayfasi />
              </ProtectedRoute>
            }
          />


          <Route
            path="/istatistik"
            element={
              <ProtectedRoute izinVerilenRoller={['admin']}>
                <IstatistikSayfasi />
              </ProtectedRoute>
            }
          />
        </Route>

    
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PosProvider>
  );
}