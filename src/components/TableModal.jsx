import { useState } from 'react';

export default function TableModal({ acikMi, kapat, seciliAlan, handleMasaEkle, yukleniyor }) {
  const [masaAdi, setMasaAdi] = useState('');
  const [masaTipi, setMasaTipi] = useState('Standart');
  const [sandalyeSayisi, setSandalyeSayisi] = useState(4);

  if (!acikMi) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!masaAdi.trim()) return;

    handleMasaEkle({
      ad: masaAdi.trim(),
      tip: masaTipi,
      sandalye_sayisi: Number(sandalyeSayisi),
      alan: seciliAlan?.ad || 'Salon',
      alanId: seciliAlan?.id || '',
    });

    setMasaAdi('');
    setSandalyeSayisi(4);
    kapat();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <span className="text-success">{seciliAlan?.ad || 'Salon'}</span> Alanına Masa Ekle
            </h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body py-3">
              <div className="mb-3">
                <label className="form-label text-muted fw-bold text-uppercase small">
                  Masa Adı / Numarası
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={masaAdi}
                  onChange={(e) => setMasaAdi(e.target.value)}
                  placeholder="Örn: Masa 1, VIP 3"
                  className="form-control rounded-3 py-2"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold text-uppercase small">
                  Masa Tipi
                </label>
                <select
                  value={masaTipi}
                  onChange={(e) => setMasaTipi(e.target.value)}
                  className="form-select rounded-3 py-2"
                >
                  <option value="Standart">Standart Masa</option>
                  <option value="Dikdörtgen / Uzun Masa">Dikdörtgen / Uzun Masa</option>
                  <option value="Bar / Yüksek">Bar / Yüksek Masa</option>
                  <option value="Yuvarlak Masa">Yuvarlak Masa</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold text-uppercase small">
                  Sandalye / Koltuk Sayısı
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={sandalyeSayisi}
                  onChange={(e) => setSandalyeSayisi(e.target.value)}
                  className="form-control rounded-3 py-2"
                />
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light rounded-3 fw-bold" onClick={kapat}>
                İptal
              </button>
              <button type="submit" disabled={yukleniyor} className="btn btn-success rounded-3 fw-bold px-4">
                {yukleniyor ? 'Ekleniyor...' : 'Masayı Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}