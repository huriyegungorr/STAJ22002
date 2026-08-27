import { useState } from 'react';
import reservationService from '../services/reservationService';

export default function RezervasyonModali({ masalar, kapat }) {
  const bugun = new Date().toISOString().split('T')[0];

  const [yeniForm, setYeniForm] = useState({
    musteriAdi: '',
    telefon: '',
    kisiSayisi: 2,
    tarih: bugun,
    saat: '19:00',
    masaId: '',
    not: '',
  });

  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleTelefonChange = (e) => {
    const sadeceRakam = e.target.value.replace(/\D/g, '');
    if (sadeceRakam.length <= 11) {
      setYeniForm({ ...yeniForm, telefon: sadeceRakam });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    if (yeniForm.musteriAdi.trim().length < 3) {
      setHata('Müşteri adı en az 3 karakter olmalıdır.');
      return;
    }

    if (yeniForm.telefon.length < 10) {
      setHata('Lütfen geçerli bir telefon numarası girin (en az 10 haneli).');
      return;
    }

    if (Number(yeniForm.kisiSayisi) < 1 || Number(yeniForm.kisiSayisi) > 50) {
      setHata('Kişi sayısı 1 ile 50 arasında olmalıdır.');
      return;
    }

    if (yeniForm.tarih < bugun) {
      setHata('Geçmiş bir tarihe rezervasyon oluşturulamaz.');
      return;
    }

    const seciliMasa = masalar.find((m) => m.id === yeniForm.masaId);
    if (seciliMasa && seciliMasa.durum && seciliMasa.durum !== 'bos') {
      setHata(`Seçilen masa şu anda ${seciliMasa.durum === 'rezerve' ? 'rezerve' : 'dolu'} durumdadır. Lütfen başka bir masa seçin.`);
      return;
    }

    setYukleniyor(true);
    const kayitVerisi = {
      ...yeniForm,
      masaAd: seciliMasa ? (seciliMasa.ad || seciliMasa.name) : 'Atanmadı',
    };

    const basarili = await reservationService.handleRezervasyonEkle(kayitVerisi, masalar);
    setYukleniyor(false);

    if (basarili) {
      kapat();
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">Yeni Rezervasyon</h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-0">
              {hata && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{hata}</span>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Müşteri Ad Soyad</label>
                <input
                  type="text"
                  required
                  className="form-control rounded-3"
                  value={yeniForm.musteriAdi}
                  onChange={(e) => setYeniForm({ ...yeniForm, musteriAdi: e.target.value })}
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Telefon (Sadece Rakam)</label>
                  <input
                    type="tel"
                    required
                    className="form-control rounded-3"
                    value={yeniForm.telefon}
                    onChange={handleTelefonChange}
                    placeholder="05551234567"
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Kişi Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    className="form-control rounded-3"
                    value={yeniForm.kisiSayisi}
                    onChange={(e) => setYeniForm({ ...yeniForm, kisiSayisi: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Tarih</label>
                  <input
                    type="date"
                    min={bugun}
                    required
                    className="form-control rounded-3"
                    value={yeniForm.tarih}
                    onChange={(e) => setYeniForm({ ...yeniForm, tarih: e.target.value })}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Saat</label>
                  <input
                    type="time"
                    required
                    className="form-control rounded-3"
                    value={yeniForm.saat}
                    onChange={(e) => setYeniForm({ ...yeniForm, saat: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Ayrılacak Masa (Opsiyonel)</label>
                <select
                  className="form-select rounded-3"
                  value={yeniForm.masaId}
                  onChange={(e) => setYeniForm({ ...yeniForm, masaId: e.target.value })}
                >
                  <option value="">Masa Seçilmedi</option>
                  {masalar.map((m) => {
                    const isMasaDoluVeyaRezerve = m.durum === 'dolu' || m.durum === 'rezerve';
                    return (
                      <option key={m.id} value={m.id} disabled={isMasaDoluVeyaRezerve}>
                        {m.ad || m.name} ({m.alan || 'Salon'}) {m.durum === 'dolu' ? '— [Dolu]' : m.durum === 'rezerve' ? '— [Rezerve]' : '— [Boş]'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Özel Not</label>
                <textarea
                  className="form-control rounded-3"
                  rows="2"
                  placeholder="Örn: Cam kenarı istendi."
                  value={yeniForm.not}
                  onChange={(e) => setYeniForm({ ...yeniForm, not: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-top-0">
              <button type="button" className="btn btn-light rounded-3" onClick={kapat}>
                İptal
              </button>
              <button type="submit" disabled={yukleniyor} className="btn btn-success fw-bold rounded-3 px-4">
                {yukleniyor ? 'Kaydediliyor...' : 'Rezervasyonu Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}