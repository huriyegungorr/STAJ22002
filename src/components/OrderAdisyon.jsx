import { useState } from 'react';
import PinModal from './PinModal'; 

export default function OrderAdisyon({
  sepet,
  adetDegistir,
  toplamTutar,
  masa,
  handleHesapKapat,
  handleSiparisiKaydet,
  yukleniyor,
}) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [islemTipi, setIslemTipi] = useState(null); 

 
  const handleButonTikla = (tip) => {
    setIslemTipi(tip);
    setShowPinModal(true);
  };

  
  const handlePinVerified = (garson) => {
    setShowPinModal(false);

    if (islemTipi === 'hesapKapat') {
      handleHesapKapat(garson); 
    } else if (islemTipi === 'siparisKaydet') {
      handleSiparisiKaydet(garson); 
    }

    setIslemTipi(null);
  };

  return (
    <div className="w-100 p-4 bg-white border-start d-flex flex-column justify-content-between h-100">
      <div>
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <h5 className="fw-bold text-dark m-0">Adisyon Detayı</h5>
          <small className="text-muted">{sepet.length} Kalem Ürün</small>
        </div>

       
        <div
          className="overflow-y-auto pe-1"
          style={{ maxHeight: 'calc(100vh - 340px)' }}
        >
          {sepet.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-cart-x fs-1 d-block mb-2 text-secondary"></i>
              Henüz bir ürün eklenmedi. <br /> Soldaki menüden tıklayarak ekleyebilirsiniz.
            </div>
          ) : (
            sepet.map((item) => (
              <div
                key={item.sepetId || item.id}
                className="d-flex align-items-center justify-content-between p-3 mb-2 bg-light rounded-3"
              >
                <div>
                  <strong className="d-block text-dark small">
                    {item.urun_adi}
                  </strong>
                  
                 
                  <div className="text-muted" style={{ fontSize: 11 }}>
                    {item.seciliPorsiyon && <span className="badge bg-secondary-subtle text-secondary me-1">{item.seciliPorsiyon}</span>}
                    {item.seciliSos && <span className="badge bg-info-subtle text-info-emphasis me-1">{item.seciliSos}</span>}
                    {item.ozelNot && <div className="text-danger italic mt-1">Not: {item.ozelNot}</div>}
                  </div>

                  <small className="text-success fw-bold mt-1 d-block">
                    {item.fiyat * item.adet} TL ({item.fiyat} TL/adet)
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => adetDegistir(item.sepetId || item.id, -1)}
                    className="btn btn-sm btn-white border px-2 fw-bold rounded-2"
                  >
                    -
                  </button>
                  <span className="fw-bold px-1">{item.adet}</span>
                  <button
                    onClick={() => adetDegistir(item.sepetId || item.id, 1)}
                    className="btn btn-sm btn-white border px-2 fw-bold rounded-2"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      
      <div className="border-top pt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-5 text-muted fw-semibold">Toplam Tutar:</span>
          <span className="fs-2 fw-bold text-success">{toplamTutar} TL</span>
        </div>

        <div className="d-flex gap-2">
          {masa?.durum === 'dolu' && (
            <button
              onClick={() => handleButonTikla('hesapKapat')} 
              disabled={yukleniyor}
              className="btn btn-outline-danger fw-bold rounded-4 py-3 flex-grow-1"
            >
              Hesabı Kapat
            </button>
          )}

          <button
            onClick={() => handleButonTikla('siparisKaydet')} 
            disabled={yukleniyor || sepet.length === 0}
            className="btn btn-success btn-lg fw-bold rounded-4 py-3 flex-grow-2 w-100 shadow-sm"
          >
            {yukleniyor ? 'Kaydediliyor...' : 'Siparişi Onayla & Kaydet'}
          </button>
        </div>
      </div>

      
      <PinModal
        show={showPinModal}
        onClose={() => setShowPinModal(false)}
        onPinVerified={handlePinVerified}
      />
    </div>
  );
}