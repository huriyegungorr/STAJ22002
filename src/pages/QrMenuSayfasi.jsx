import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/pages/QrMenu.css';

export default function QrMenuSayfasi() {
  const { masaId } = useParams();
  const [masa, setMasa] = useState(null);
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verileriGetir() {
      try {
        setLoading(true);

        
        if (masaId) {
          const masalarSnap = await getDocs(collection(db, 'masalar'));
          const bulunanMasa = masalarSnap.docs.find(
            (d) => d.id === masaId || d.data().ad?.toLowerCase().replace(/\s+/g, '-') === masaId.toLowerCase()
          );
          if (bulunanMasa) {
            setMasa({ id: bulunanMasa.id, ...bulunanMasa.data() });
          }
        }

        const urunlerSnap = await getDocs(collection(db, 'urunler'));
        setUrunler(urunlerSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

   
        const kategorilerSnap = await getDocs(collection(db, 'kategoriler'));
        setKategoriler(kategorilerSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Menü yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }

    verileriGetir();
  }, [masaId]);

  const filtrelenmisUrunler =
    seciliKategori === 'Tümü'
      ? urunler
      : urunler.filter((u) => (u.kategori || 'Diğer') === seciliKategori);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="qr-mobile-wrapper min-vh-100 pb-5">
  
      <div className="bg-success text-white p-3 text-center sticky-top shadow-sm">
        <h6 className="fw-bold m-0">{masa?.ad || 'Hoş Geldiniz'}</h6>
        <small style={{ fontSize: 11 }} className="opacity-75">
          {masa?.alan ? `${masa.alan} — Dijital QR Menü` : 'Dijital QR Menü'}
        </small>
      </div>

    
      <div className="d-flex gap-2 p-3 overflow-auto bg-white border-bottom no-scrollbar">
        <button
          onClick={() => setSeciliKategori('Tümü')}
          className={`btn btn-sm rounded-pill fw-bold px-3 flex-shrink-0 ${
            seciliKategori === 'Tümü' ? 'btn-success' : 'btn-light border'
          }`}
        >
          Tümü
        </button>
        {kategoriler.map((kat) => (
          <button
            key={kat.id || kat.ad}
            onClick={() => setSeciliKategori(kat.ad)}
            className={`btn btn-sm rounded-pill fw-bold px-3 flex-shrink-0 ${
              seciliKategori === kat.ad ? 'btn-success' : 'btn-light border'
            }`}
          >
            {kat.ad}
          </button>
        ))}
      </div>

      
      <div className="p-3 d-flex flex-column gap-3 mb-5">
        {filtrelenmisUrunler.length === 0 ? (
          <div className="text-center py-4 text-muted small">Bu kategoride henüz ürün yok.</div>
        ) : (
          filtrelenmisUrunler.map((urun) => (
            <div
              key={urun.id}
              className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center justify-content-between bg-white"
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={urun.gorsel_url || 'https://placehold.co/80x80/e9ecef/198754?text=Yemek'}
                  alt={urun.urun_adi}
                  className="rounded-3 border"
                  style={{ width: 70, height: 70, objectFit: 'cover', flexShrink: 0 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/80x80/e9ecef/198754?text=Yemek';
                  }}
                />
                <div>
                  <h6 className="fw-bold m-0 text-dark">{urun.urun_adi}</h6>
                  {urun.aciklama && (
                    <small
                      className="text-muted d-block text-truncate"
                      style={{ maxWidth: '170px', fontSize: 11 }}
                    >
                      {urun.aciklama}
                    </small>
                  )}
                  <strong className="text-success small d-block mt-1">{urun.fiyat} TL</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

   
      <div
        className="fixed-bottom p-3 bg-white border-top text-center shadow-lg"
        style={{ maxWidth: '430px', margin: '0 auto' }}
      >
        <small className="text-muted fw-bold d-block">
          <i className="bi bi-info-circle text-success me-1"></i>
          Siparişinizi vermek için lütfen garsona bildiriniz.
        </small>
      </div>
    </div>
  );
}