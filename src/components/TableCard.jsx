import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';

export default function TableCard({ masa, rezervasyonlar = [], handleMasaSil, handleMasaGuncelle }) {
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const navigate = useNavigate();

 
  const aktifRezervasyon = (rezervasyonlar || []).find(
    (r) => r.masaId === masa.id && (r.durum === 'Bekliyor' || r.durum === 'Onaylandı')
  );

  const handleSiparisEkranaGit = async () => {
    if (duzenlemeModu) return;

    if (masa.durum === 'rezerve') {
      const musteriAdi = aktifRezervasyon?.musteriAdi || 'Müşteri';
      const onay = window.confirm(
        `Bu masa (${masa.ad || masa.name}) REZERVEDİR!\nRezervasyon sahibi (${musteriAdi}) geldi mi? Masa açılsın mı?`
      );

      if (onay) {

        if (aktifRezervasyon) {
          await reservationService.handleRezervasyonDurumGuncelle(aktifRezervasyon, 'Geldi');
        }

        await handleMasaGuncelle(masa.id, {
          ...masa,
          durum: 'dolu',
          adisyon: masa.adisyon || []
        });

        navigate(`/siparis/${masa.id}`);
      }
      return;
    }

    navigate(`/siparis/${masa.id}`);
  };

  const [ad, setAd] = useState(masa.ad || masa.name || '');
  const [tip, setTip] = useState(masa.tip || masa.type || 'Standart');
  const [sandalyeSayisi, setSandalyeSayisi] = useState(
    masa.sandalye_sayisi || masa.chairs || 4
  );

  const onKaydet = (e) => {
    e.preventDefault();
    handleMasaGuncelle(masa.id, {
      ...masa,
      ad,
      tip,
      sandalye_sayisi: Number(sandalyeSayisi),
    });
    setDuzenlemeModu(false);
  };

  const isDolu = masa.durum === 'dolu';
  const isRezerve = masa.durum === 'rezerve';

  const borderLeftColor = isDolu
    ? '6px solid #dc3545' 
    : isRezerve
    ? '6px solid #ffc107' 
    : '6px solid #198754'; 

  return (
    <div className="col">
      <div
        onClick={handleSiparisEkranaGit}
        className="card border-0 shadow-sm rounded-4 p-3 h-100 d-flex flex-column justify-content-between position-relative"
        style={{
          cursor: duzenlemeModu ? 'default' : 'pointer',
          borderLeft: borderLeftColor,
          backgroundColor: isRezerve ? '#fffdf5' : '#ffffff', 
        }}
      >
        {!duzenlemeModu ? (
          <>
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold m-0 text-dark">
                  {masa.ad || masa.name}
                </h6>
                <span
                  className={`badge rounded-pill ${
                    isDolu
                      ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
                      : isRezerve
                      ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                      : 'bg-success-subtle text-success-emphasis border border-success-subtle'
                  }`}
                >
                  {isDolu ? 'Dolu' : isRezerve ? 'Rezerve' : 'Boş'}
                </span>
              </div>

              {isRezerve ? (
                <div className="bg-warning-subtle p-2 rounded-3 my-2 text-center">
                  <small className="text-warning-emphasis fw-bold d-block" style={{ fontSize: 11 }}>
                    <i className="bi bi-clock-history me-1"></i>
                    {aktifRezervasyon?.saat ? `Saat: ${aktifRezervasyon.saat}` : 'Rezervasyonlu'}
                  </small>
                  <span className="fw-semibold text-dark fs-6 d-block text-truncate">
                    {aktifRezervasyon?.musteriAdi || 'Müşteri Bilgisi Yok'}
                  </span>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between text-muted small mt-3">
                  <span title="Masa Tipi">
                    <i className="bi bi-shop me-1 text-secondary"></i>
                    {masa.tip || masa.type || 'Standart'}
                  </span>
                  <span title="Sandalye Sayısı">
                    <i className="bi bi-person-seat me-1 text-secondary"></i>
                    {masa.sandalye_sayisi || masa.chairs || 4} Kişilik
                  </span>
                </div>
              )}

              <div
                className="text-center text-muted border-top pt-2 mt-3"
                style={{ fontSize: 11 }}
              >
                <i className="bi bi-hand-index-thumb me-1"></i>
                {isRezerve ? 'Masa detayına git' : 'Sipariş açmak için tıklayın'}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDuzenlemeModu(true);
                }}
                className="btn btn-light border btn-sm text-secondary fw-bold rounded-3"
              >
                <i className="bi bi-pencil me-1"></i> Düzenle
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMasaSil(masa.id);
                }}
                className="btn btn-outline-danger btn-sm border-0 fw-bold"
              >
                Sil
              </button>
            </div>
          </>
        ) : (
          <form
            onSubmit={onKaydet}
            className="d-flex flex-column gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fw-bold text-dark border-bottom pb-1 small">
              Masa Bilgilerini Güncelle
            </div>

            <div>
              <label className="text-muted small fw-semibold">Masa Adı</label>
              <input
                type="text"
                required
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                className="form-control form-control-sm rounded-2"
              />
            </div>

            <div>
              <label className="text-muted small fw-semibold">Masa Tipi</label>
              <select
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                className="form-select form-select-sm rounded-2"
              >
                <option value="Standart">Standart Masa</option>
                <option value="Dikdörtgen / Uzun Masa">
                  Dikdörtgen / Uzun Masa
                </option>
                <option value="Bar / Yüksek">Bar / Yüksek Masa</option>
                <option value="Yuvarlak Masa">Yuvarlak Masa</option>
              </select>
            </div>

            <div>
              <label className="text-muted small fw-semibold">
                Sandalye Sayısı
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={sandalyeSayisi}
                onChange={(e) => setSandalyeSayisi(e.target.value)}
                className="form-control form-control-sm rounded-2"
              />
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setDuzenlemeModu(false)}
                className="btn btn-light btn-sm rounded-2"
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-success btn-sm fw-bold rounded-2"
              >
                Kaydet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}