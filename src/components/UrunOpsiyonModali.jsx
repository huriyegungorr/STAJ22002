import { useState } from 'react';

export default function UrunOpsiyonModali({ urun, kapat, onOnayla }) {

  const anaFiyat = Number(String(urun.fiyat || 0).replace(/[^0-9.]/g, '')) || 0;

  const porsiyonlar = urun.porsiyonlar || [];
  const soslar = Array.isArray(urun.soslar) && urun.soslar.length > 0 ? urun.soslar : [];

  const [seciliPorsiyon, setSeciliPorsiyon] = useState(
    porsiyonlar.length > 0 ? porsiyonlar[0] : null
  );
  const [seciliSos, setSeciliSos] = useState(
    soslar.length > 0 ? soslar[0] : null
  );
  const [ozelNot, setOzelNot] = useState('');

  const porsiyonFarki = seciliPorsiyon ? Number(seciliPorsiyon.fiyatFarki || 0) : 0;
  const birimFiyat = anaFiyat + porsiyonFarki;

  const handleEkle = () => {
    onOnayla({
      ...urun,
      urun_adi: urun.urun_adi || urun.ad,
      seciliPorsiyon: seciliPorsiyon ? seciliPorsiyon.ad : null,
      seciliSos: seciliSos || null,
      ozelNot: ozelNot || null,
      fiyat: birimFiyat,

      sepetId: `${urun.id}_${seciliPorsiyon?.ad || 'std'}_${seciliSos || 'yok'}_${ozelNot || ''}`,
    });
    kapat();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-dark">
              {urun.urun_adi || urun.ad} — Seçenekler
            </h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <div className="modal-body p-4">
            
          
            {porsiyonlar.length > 0 && (
              <div className="mb-4">
                <label className="fw-bold text-dark mb-2 small d-block">Porsiyon Seçin:</label>
                <div className="d-flex flex-column gap-2">
                  {porsiyonlar.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSeciliPorsiyon(p)}
                      className={`btn w-100 text-start d-flex justify-content-between align-items-center rounded-3 p-3 border ${
                        seciliPorsiyon?.ad === p.ad
                          ? 'btn-success text-white fw-bold'
                          : 'btn-light text-dark'
                      }`}
                    >
                      <span className="fw-semibold">{p.ad}</span>
                      <span className="badge bg-white text-dark border px-2 py-1">
                        {p.fiyatFarki > 0
                          ? `+${p.fiyatFarki} TL`
                          : p.fiyatFarki < 0
                          ? `${p.fiyatFarki} TL`
                          : 'Standart Fiyat'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

           
            {soslar.length > 0 && (
              <div className="mb-4">
                <label className="fw-bold text-dark mb-2 small d-block">Sos / Hazırlanış Seçeneği:</label>
                <div className="d-flex flex-wrap gap-2">
                  {soslar.map((sos, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSeciliSos(sos)}
                      className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold ${
                        seciliSos === sos ? 'btn-dark text-white' : 'btn-outline-secondary'
                      }`}
                    >
                      {sos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            
            <div>
              <label className="fw-bold text-dark mb-1 small d-block">Mutfak Notu / İstek:</label>
              <input
                type="text"
                placeholder="Örn: Az pişsin, peynirsiz olsun..."
                value={ozelNot}
                onChange={(e) => setOzelNot(e.target.value)}
                className="form-control form-control-sm rounded-3"
              />
            </div>

          </div>

          <div className="modal-footer border-top p-3">
            <button type="button" onClick={kapat} className="btn btn-light rounded-3 fw-bold">
              İptal
            </button>
            <button type="button" onClick={handleEkle} className="btn btn-success rounded-3 fw-bold px-4">
              Sepete Ekle ({birimFiyat} TL)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}