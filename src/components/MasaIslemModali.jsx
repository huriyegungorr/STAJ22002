import { useState } from 'react';
import { usePos } from '../context/PosContext';

export default function MasaIslemModali({ mevcutMasa, kapat }) {
  const { masalar, masaTasi, masaBirlestir } = usePos();

  const [islemTipi, setIslemTipi] = useState('tasi'); 
  const [seciliHedefMasaId, setSeciliHedefMasaId] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const uygunHedefMasalar = masalar.filter((m) => {
    if (m.id === mevcutMasa.id) return false;
    return islemTipi === 'tasi' ? m.durum !== 'dolu' : m.durum === 'dolu';
  });

  const handleIslemiOnayla = async () => {
    if (!seciliHedefMasaId) {
      alert('Lütfen hedef bir masa seçin!');
      return;
    }

    setYukleniyor(true);
    let basarili = false;

    if (islemTipi === 'tasi') {
      basarili = await masaTasi(mevcutMasa.id, seciliHedefMasaId);
    } else {
      basarili = await masaBirlestir(mevcutMasa.id, seciliHedefMasaId);
    }

    setYukleniyor(false);

    if (basarili) {
      alert(islemTipi === 'tasi' ? 'Masa başarıyla taşındı!' : 'Masalar başarıyla birleştirildi!');
      kapat();
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-dark">
              Masa Operasyonları — <span className="text-warning">{mevcutMasa.ad}</span>
            </h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <div className="modal-body p-4">
            
            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                onClick={() => {
                  setIslemTipi('tasi');
                  setSeciliHedefMasaId('');
                }}
                className={`btn py-2 fw-bold ${
                  islemTipi === 'tasi' ? 'btn-dark' : 'btn-outline-dark'
                }`}
              >
                <i className="bi bi-arrow-right-circle me-1"></i> Masa Taşı
              </button>
              <button
                type="button"
                onClick={() => {
                  setIslemTipi('birlestir');
                  setSeciliHedefMasaId('');
                }}
                className={`btn py-2 fw-bold ${
                  islemTipi === 'birlestir' ? 'btn-dark' : 'btn-outline-dark'
                }`}
              >
                <i className="bi bi-intersect me-1"></i> Masa Birleştir
              </button>
            </div>

         
            <div className="alert alert-info border-0 rounded-3 small mb-3">
              {islemTipi === 'tasi'
                ? `"${mevcutMasa.ad}" masasının adisyonunu boş bir masaya aktarırsınız.`
                : `"${mevcutMasa.ad}" masasının adisyonunu dolu başka bir masanın adisyonuyla birleştirirsiniz.`}
            </div>

          
            <label className="fw-bold text-dark mb-2 small d-block">
              Hedef Masa Seçin:
            </label>
            {uygunHedefMasalar.length === 0 ? (
              <div className="text-center text-muted py-3 bg-light rounded-3 small">
                Uygun hedef masa bulunamadı.
              </div>
            ) : (
              <select
                value={seciliHedefMasaId}
                onChange={(e) => setSeciliHedefMasaId(e.target.value)}
                className="form-select form-select-lg rounded-3 fs-6"
              >
                <option value="">-- Masa Seçiniz --</option>
                {uygunHedefMasalar.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.ad} ({m.durum === 'dolu' ? `Dolu - ${m.toplam_tutar || 0} TL` : 'Boş'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="modal-footer border-top p-3">
            <button type="button" onClick={kapat} className="btn btn-light rounded-3 fw-bold">
              İptal
            </button>
            <button
              type="button"
              disabled={!seciliHedefMasaId || yukleniyor}
              onClick={handleIslemiOnayla}
              className="btn btn-warning fw-bold rounded-3 px-4 text-dark"
            >
              {yukleniyor ? 'İşleniyor...' : 'İşlemi Onayla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}