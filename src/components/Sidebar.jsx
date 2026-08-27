import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onMenuTikla }) {
  const { rol } = useAuth();

  const handleLinkClick = () => {
    if (onMenuTikla) onMenuTikla();
  };

  return (
    <aside className="d-flex flex-column justify-content-between h-100 p-3 bg-white">
      <div>
        <div className="d-flex align-items-center justify-content-between px-2 py-2 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-success text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
              <i className="bi bi-shop fs-5"></i>
            </div>
            <div>
              <h6 className="fw-bold m-0 text-dark">Restoran POS</h6>
              <small className="text-muted text-uppercase" style={{ fontSize: 10 }}>
                {rol === 'admin' ? 'Yönetici' : rol === 'mutfak' ? 'Mutfak' : 'Garson'}
              </small>
            </div>
          </div>
          
         
          {onMenuTikla && (
            <button onClick={onMenuTikla} className="btn btn-sm btn-light border-0 d-lg-none">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <nav className="nav nav-pills flex-column gap-1">
          <NavLink
            to="/"
            end
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
              }`
            }
          >
            <i className="bi bi-house-door-fill"></i>
            <span>Ana Sayfa</span>
          </NavLink>

          {(rol === 'admin' || rol === 'garson') && (
            <NavLink
              to="/masalar"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
                }`
              }
            >
              <i className="bi bi-grid-fill"></i>
              <span>Masa Yönetimi</span>
            </NavLink>
          )}

          {(rol === 'admin' || rol === 'garson') && (
            <NavLink
              to="/rezervasyon"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
                }`
              }
            >
              <i className="bi bi-calendar-check-fill"></i>
              <span>Rezervasyonlar</span>
            </NavLink>
          )}

          {rol === 'admin' && (
            <NavLink
              to="/menu"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
                }`
              }
            >
              <i className="bi bi-cup-hot-fill"></i>
              <span>Menü & Ürünler</span>
            </NavLink>
          )}

          {(rol === 'admin' || rol === 'mutfak' || rol === 'garson') && (
            <NavLink
              to="/mutfak"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
                }`
              }
            >
              <i className="bi bi-fire"></i>
              <span>Mutfak Ekranı</span>
            </NavLink>
          )}

          {rol === 'admin' && (
            <NavLink
              to="/istatistik"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
                }`
              }
            >
              <i className="bi bi-bar-chart-line-fill"></i>
              <span>Raporlar</span>
            </NavLink>
          )}

          {rol === 'admin' && (
            <NavLink
              to="/ayarlar"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold ${
                  isActive ? 'bg-success text-white' : 'text-secondary bg-transparent'
                }`
              }
            >
              <i className="bi bi-gear-fill"></i>
              <span>İşletme Ayarları</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="p-2 border-top text-center text-muted small" style={{ fontSize: 11 }}>
        Restoran POS
      </div>
    </aside>
  );
}