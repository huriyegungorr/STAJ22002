import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePos } from '../context/PosContext';
import orderService from '../services/orderService';

import OrderMenu from '../components/OrderMenu';
import OrderAdisyon from '../components/OrderAdisyon';
import OdemeModali from '../components/OdemeModali';
import MasaIslemModali from '../components/MasaIslemModali'; 

export default function SiparisSayfasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { masalar, urunler, kategoriler, masalarYukleniyor } = usePos();

  const masa = masalar.find((m) => m.id === id);

  const [sepet, setSepet] = useState([]);
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const [odemeModalAcik, setOdemeModalAcik] = useState(false);
  const [islemModaliAcik, setIslemModaliAcik] = useState(false); 
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mobilAdisyonAcik, setMobilAdisyonAcik] = useState(false);

  useEffect(() => {
    if (masa?.adisyon) {
      setSepet(masa.adisyon);
    }
  }, [masa]);

  if (masalarYukleniyor) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Masa Bilgileri Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!masa) {
    return (
      <div className="container text-center py-5">
        <h4>Masa Bulunamadı!</h4>
        <button onClick={() => navigate('/masalar')} className="btn btn-dark mt-3">
          Masalara Dön
        </button>
      </div>
    );
  }

  const toplamTutar = sepet.reduce((toplam, item) => toplam + item.fiyat * item.adet, 0);

  const sepeteEkle = (urun) => {
    const temelSepetId = `${urun.id}-${urun.seciliPorsiyon || ''}-${urun.seciliSos || ''}-${urun.ozelNot || ''}`;

    const mevcutIndex = sepet.findIndex(
      (item) =>
        item.sepetId?.startsWith(temelSepetId) &&
        (!item.mutfakDurumu || item.mutfakDurumu === 'bekliyor')
    );

    if (mevcutIndex > -1) {
      const yeniSepet = [...sepet];
      yeniSepet[mevcutIndex] = {
        ...yeniSepet[mevcutIndex],
        adet: yeniSepet[mevcutIndex].adet + 1,
      };
      setSepet(yeniSepet);
    } else {
      const benzersizSepetId = `${temelSepetId}-${Date.now()}`;

      setSepet([
        ...sepet,
        {
          ...urun,
          sepetId: benzersizSepetId,
          adet: 1,
          mutfakDurumu: 'bekliyor',
          eklenmeZamani: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const adetDegistir = (sepetId, degisim) => {
    const yeniSepet = sepet
      .map((item) => {
        if ((item.sepetId || item.id) === sepetId) {
          const yeniAdet = item.adet + degisim;
          return yeniAdet > 0 ? { ...item, adet: yeniAdet } : null;
        }
        return item;
      })
      .filter(Boolean);
    setSepet(yeniSepet);
  };

  const onSiparisKaydet = async () => {
    setYukleniyor(true);
    const basarili = await orderService.handleSiparisiKaydet(id, sepet, toplamTutar);
    setYukleniyor(false);
    if (basarili) {
      alert('Sipariş başarıyla kaydedildi!');
      navigate('/masalar');
    }
  };

  const onOdemeOnay = async (odemeDetayi) => {
    setYukleniyor(true);
    const basarili = await orderService.handleHesapKapat(id, odemeDetayi);
    setYukleniyor(false);
    if (basarili) {
      setOdemeModalAcik(false);
      navigate('/masalar');
    }
  };

  const filtrelenmisUrunler =
    seciliKategori === 'Tümü'
      ? urunler
      : urunler.filter(
          (u) =>
            u.kategoriId === seciliKategori ||
            u.kategori === seciliKategori ||
            (u.kategori || 'Diğer') === seciliKategori
        );

  return (
    <div className="d-flex flex-column vh-100 bg-light">

      <div className="bg-white border-bottom px-3 px-md-4 py-2 py-md-3 d-flex align-items-center justify-content-between shadow-sm flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <button
            onClick={() => navigate('/masalar')}
            className="btn btn-outline-secondary btn-sm rounded-3 fw-bold d-flex align-items-center gap-1"
          >
            <i className="bi bi-arrow-left"></i>
            <span className="d-none d-sm-inline">Masalara Dön</span>
          </button>

          <div className="vr me-1 d-none d-sm-block"></div>

          <div>
            <h5 className="fw-bold m-0 text-dark d-flex align-items-center gap-2 fs-6 fs-md-5">
              <span>{masa.ad || masa.name}</span>
              <span
                className={`badge rounded-pill ${
                  masa.durum === 'dolu'
                    ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                    : 'bg-success-subtle text-success-emphasis border border-success-subtle'
                }`}
                style={{ fontSize: 11 }}
              >
                {masa.durum === 'dolu' ? 'Dolu' : 'Boş'}
              </span>
            </h5>
            <small className="text-muted d-none d-sm-block" style={{ fontSize: 11 }}>
              {masa.alan || 'Salon'} | {masa.sandalye_sayisi || 4} Kişilik Masa
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {masa.durum === 'dolu' && (
            <button
              onClick={() => setIslemModaliAcik(true)}
              className="btn btn-outline-dark btn-sm rounded-3 fw-bold d-flex align-items-center gap-1 gap-md-2 shadow-sm"
            >
              <i className="bi bi-arrow-left-right text-warning fs-6"></i>
              <span className="d-none d-md-inline">Masa Taşı / Birleştir</span>
            </button>
          )}

          <div className="text-end">
            <small className="text-muted d-block" style={{ fontSize: 10 }}>
              Masa Tutarı
            </small>
            <strong className="fs-6 fs-md-5 text-success">{toplamTutar} TL</strong>
          </div>
        </div>
      </div>

  
      <div className="d-flex flex-grow-1 overflow-hidden position-relative">
        
   
        <div className="flex-grow-1 overflow-y-auto pb-5 pb-lg-0">
          <OrderMenu
            kategoriler={kategoriler}
            seciliKategori={seciliKategori}
            setSeciliKategori={setSeciliKategori}
            filtrelenmisUrunler={filtrelenmisUrunler}
            sepeteEkle={sepeteEkle}
          />
        </div>

        
        <div className="d-none d-lg-block border-start bg-white h-100" style={{ width: '400px', minWidth: '400px' }}>
          <OrderAdisyon
            sepet={sepet}
            adetDegistir={adetDegistir}
            toplamTutar={toplamTutar}
            masa={masa}
            handleHesapKapat={() => setOdemeModalAcik(true)}
            handleSiparisiKaydet={onSiparisKaydet}
            yukleniyor={yukleniyor}
          />
        </div>
      </div>

     
      <div className="d-lg-none fixed-bottom bg-white p-3 border-top shadow-lg d-flex justify-content-between align-items-center z-3">
        <div>
          <small className="text-muted d-block">{sepet.length} Kalem Ürün</small>
          <span className="fs-5 fw-bold text-success">{toplamTutar} TL</span>
        </div>
        <button
          onClick={() => setMobilAdisyonAcik(true)}
          className="btn btn-success fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
        >
          <i className="bi bi-receipt"></i>
          <span>Adisyonu Gör</span>
        </button>
      </div>


      {mobilAdisyonAcik && (
        <div className="modal d-block d-lg-none bg-dark bg-opacity-50 z-3" tabIndex="-1">
          <div className="modal-dialog modal-fullscreen m-0">
            <div className="modal-content">
              <div className="modal-header border-bottom py-2">
                <h6 className="modal-title fw-bold">Masa Sipariş & Adisyon</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMobilAdisyonAcik(false)}
                ></button>
              </div>
              <div className="modal-body p-0 h-100">
                <OrderAdisyon
                  sepet={sepet}
                  adetDegistir={adetDegistir}
                  toplamTutar={toplamTutar}
                  masa={masa}
                  handleHesapKapat={() => {
                    setMobilAdisyonAcik(false);
                    setOdemeModalAcik(true);
                  }}
                  handleSiparisiKaydet={onSiparisKaydet}
                  yukleniyor={yukleniyor}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {odemeModalAcik && (
        <OdemeModali
          toplamTutar={toplamTutar}
          kapat={() => setOdemeModalAcik(false)}
          onOdemeOnay={onOdemeOnay}
          yukleniyor={yukleniyor}
        />
      )}


      {islemModaliAcik && (
        <MasaIslemModali
          mevcutMasa={masa}
          kapat={() => setIslemModaliAcik(false)}
        />
      )}
    </div>
  );
}