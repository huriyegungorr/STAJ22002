import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function ProtectedRoute({ children, izinVerilenRoller }) {
  const { user, rol, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Yetki kontrol ediliyor...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (izinVerilenRoller && !izinVerilenRoller.includes(rol)) {
    if (rol === 'mutfak') {
      return <Navigate to="/mutfak" replace />;
    }
    return <Navigate to="/masalar" replace />;
  }

  return children;
}