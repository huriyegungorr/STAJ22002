import { useState } from 'react';
import IsletmeBilgileriFormu from '../components/IsletmeBilgileriFormu';
import PersonelYonetimi from '../components/PersonelYonetimi';
import MasaQrKodlari from '../components/MasaQrKodlari';

export default function AyarlarSayfasi() {
  const [aktifSekme, setAktifSekme] = useState('isletme'); 
  const [mesaj, setMesaj] = useState('');

  const mesajGoster = (metin) => {
    setMesaj(metin);
    setTimeout(() => setMesaj(''), 3000);
  };

  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">

      <div className="flex-grow-1 d-flex flex-column h-100 overflow-auto">
       

        <main className="p-4">
          
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <ul className="nav nav-pills gap-2 bg-white p-1.5 rounded-4 border shadow-sm">
              <li className="nav-item">
                <button
                  onClick={() => setAktifSekme('isletme')}
                  className={`nav-link fw-bold px-4 py-2 rounded-3 ${
                    aktifSekme === 'isletme' ? 'bg-success text-white' : 'text-secondary'
                  }`}
                >
                  <i className="bi bi-building me-2"></i>İşletme Bilgileri
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setAktifSekme('personel')}
                  className={`nav-link fw-bold px-4 py-2 rounded-3 ${
                    aktifSekme === 'personel' ? 'bg-success text-white' : 'text-secondary'
                  }`}
                >
                  <i className="bi bi-people me-2"></i>Personeller & PIN
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setAktifSekme('qr')}
                  className={`nav-link fw-bold px-4 py-2 rounded-3 ${
                    aktifSekme === 'qr' ? 'bg-success text-white' : 'text-secondary'
                  }`}
                >
                  <i className="bi bi-qr-code me-2"></i>Masa QR Kodları
                </button>
              </li>
            </ul>
          </div>

          {mesaj && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {mesaj}
            </div>
          )}

          
          {aktifSekme === 'isletme' && <IsletmeBilgileriFormu onMesajGoster={mesajGoster} />}
          {aktifSekme === 'personel' && <PersonelYonetimi />}
          {aktifSekme === 'qr' && <MasaQrKodlari />}
        </main>
      </div>
    </div>
  );
}