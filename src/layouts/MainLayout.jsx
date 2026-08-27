import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const location = useLocation();

  const aktifSekme = location.pathname.replace('/', '') || 'anasayfa';

  const isSiparisSayfasi = location.pathname.startsWith('/siparis');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
      
   
      <div 
        className="d-none d-lg-block bg-white border-end shadow-sm flex-shrink-0"
        style={{ width: '260px', height: '100%' }}
      >
        <Sidebar />
      </div>

      {mobilMenuAcik && (
        <div
          onClick={() => setMobilMenuAcik(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '280px', height: '100%', backgroundColor: '#fff' }}
          >
            <Sidebar onMenuTikla={() => setMobilMenuAcik(false)} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {!isSiparisSayfasi && (
          <Header aktifSekme={aktifSekme} onHamburgerTikla={() => setMobilMenuAcik(true)} />
        )}
        
        <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}