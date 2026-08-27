import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Header({ aktifSekme, onHamburgerTikla }) {
  const { user, rol } = useAuth();

  const handleCikisYap = async () => {
    if (window.confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Çıkış hatası:', error);
      }
    }
  };

  const baslikGetir = () => {
    switch (aktifSekme) {
      case 'anasayfa': return 'Anasayfa';
      case 'masalar': return 'Masa Yönetimi';
      case 'menu': return 'Menü & Ürün Yönetimi';
      case 'rezervasyon': return 'Rezervasyon Yönetimi';
      case 'mutfak': return 'Mutfak Sipariş Ekranı';
      case 'ayarlar': return 'İşletme Ayarları';
      case 'istatistik': return 'Raporlar';
      default: return 'Restoran POS';
    }
  };

  const ad = rol === 'admin' ? 'Admin' : rol === 'mutfak' ? 'Mutfak Ekranı' : (user?.email?.split('@')[0] || 'Garson');

  return (
    <header 
      className="w-100 bg-white border-bottom px-3 px-md-4 d-flex align-items-center justify-content-between"
      style={{ height: '70px', minHeight: '70px' }}
    >
  
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          onClick={onHamburgerTikla}
          className="btn btn-light border btn-sm d-lg-none rounded-3 px-2 py-1"
          title="Menüyü Aç"
        >
          <i className="bi bi-list fs-4 text-dark"></i>
        </button>

        <h5 className="fw-bold m-0 text-dark fs-6 fs-md-5">
          {baslikGetir()}
        </h5>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        <div className="d-flex align-items-center gap-2 bg-light border px-2.5 px-md-3 py-1 rounded-4">
          <div
            className="fw-bold rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
            style={{ width: 28, height: 28, fontSize: 13 }}
          >
            {ad.charAt(0).toUpperCase()}
          </div>
          <span className="fw-bold text-dark text-capitalize small d-none d-sm-inline">
            {ad}
          </span>
        </div>

        <button
          onClick={handleCikisYap}
          className="btn btn-outline-danger btn-sm rounded-3 px-2.5 px-md-3 fw-semibold d-flex align-items-center gap-1"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="d-none d-md-inline">Çıkış</span>
        </button>
      </div>
    </header>
  );
}