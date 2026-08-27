import { useState } from 'react';
import { usePos } from '../context/PosContext';
import kitchenService from '../services/kitchenService';

import MutfakMasaKarti from '../components/MutfakMasaKarti';
import MutfakIptalModali from '../components/MutfakIptalModali';
import '../styles/pages/mutfak.css';

export default function MutfakEkrani() {
  const { masalar, masalarYukleniyor } = usePos();

  const [iptalModaliAcik, setIptalModaliAcik] = useState(false);
  const [iptalHedef, setIptalHedef] = useState(null);

  const siparisiOlanMasalar = masalar.filter(
    (m) => m.durum === 'dolu' && m.adisyon && m.adisyon.length > 0
  );

  const iptalModaliBaslat = (masaId, adisyon, index, urunAdi) => {
    setIptalHedef({ masaId, adisyon, index, urunAdi });
    setIptalModaliAcik(true);
  };

  const handleIptalOnayla = async (nihaiNot) => {
    if (!iptalHedef) return;

    await kitchenService.handleSiparisIptalEt(
      iptalHedef.masaId,
      iptalHedef.adisyon,
      iptalHedef.index,
      nihaiNot
    );

    setIptalModaliAcik(false);
    setIptalHedef(null);
  };

  return (
    <div className="mutfak-container">
      <div className="mutfak-content">
        

        <div className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
            <div>
              <h4 className="fw-bold m-0 text-dark d-flex align-items-center gap-2">
                <i className="bi bi-fire text-success fs-3"></i>
                <span>Mutfak Canlı Sipariş Ekranı</span>
              </h4>
              <small className="text-muted">
                Gelen siparişleri takip edin ve hazırlanma durumlarını güncelleyin.
              </small>
            </div>
            <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle fs-6 px-3 py-2 rounded-pill fw-bold">
              <i className="bi bi-receipt me-2"></i>
              {siparisiOlanMasalar.length} Aktif Sipariş
            </span>
          </div>

          {masalarYukleniyor ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : siparisiOlanMasalar.length === 0 ? (
            <div className="text-center py-5 my-5 text-muted">
              <i className="bi bi-check2-circle display-1 text-success opacity-50 d-block mb-3"></i>
              <h5 className="fw-bold text-dark">Mutfakta Bekleyen Sipariş Yok</h5>
              <small>Tüm siparişler teslim edildi veya henüz sipariş girilmedi.</small>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {siparisiOlanMasalar.map((masa) => (
                <MutfakMasaKarti
                  key={masa.id}
                  masa={masa}
                  onIptalBaslat={iptalModaliBaslat}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <MutfakIptalModali
        acikMi={iptalModaliAcik}
        iptalHedef={iptalHedef}
        kapat={() => setIptalModaliAcik(false)}
        onOnayla={handleIptalOnayla}
      />
    </div>
  );
}