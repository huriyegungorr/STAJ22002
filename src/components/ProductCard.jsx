import { useState } from 'react';

export default function ProductCard({
  urun,
  handleDurumDegistir,
  handleUrunSil,
  handleUrunGuncelle,
}) {
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekAd, setDuzenlenecekAd] = useState(urun.urun_adi || '');
  const [duzenlenecekFiyat, setDuzenlenecekFiyat] = useState(urun.fiyat || 0);
  const [duzenlenecekKategori, setDuzenlenecekKategori] = useState(urun.kategori || 'Diğer');
  const [duzenlenecekAciklama, setDuzenlenecekAciklama] = useState(urun.aciklama || '');
  const [duzenlenecekGorsel, setDuzenlenecekGorsel] = useState(urun.gorsel_url || '');

  
  const [porsiyonlar, setPorsiyonlar] = useState(urun.porsiyonlar || []);
  const [porsiyonZorunlu, setPorsiyonZorunlu] = useState(urun.porsiyonZorunlu || false);

  const [ekstralar, setEkstralar] = useState(urun.ekstralar || []);
  const [ekstraZorunlu, setEkstraZorunlu] = useState(urun.ekstraZorunlu || false);

  const handleGorselSecimi = (e) => {
    const dosya = e.target.files[0];
    if (dosya) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDuzenlenecekGorsel(reader.result);
      };
      reader.readAsDataURL(dosya);
    }
  };


  const porsiyonEkle = () => {
    setPorsiyonlar([...porsiyonlar, { ad: '', fiyatFarki: 0 }]);
  };
  const porsiyonGuncelle = (index, alan, deger) => {
    const yeniList = [...porsiyonlar];
    yeniList[index][alan] = alan === 'fiyatFarki' ? Number(deger) : deger;
    setPorsiyonlar(yeniList);
  };
  const porsiyonSil = (index) => {
    setPorsiyonlar(porsiyonlar.filter((_, i) => i !== index));
  };

  const ekstraEkle = () => {
    setEkstralar([...ekstralar, { ad: '', fiyatFarki: 0 }]);
  };
  const ekstraGuncelle = (index, alan, deger) => {
    const yeniList = [...ekstralar];
    yeniList[index][alan] = alan === 'fiyatFarki' ? Number(deger) : deger;
    setEkstralar(yeniList);
  };
  const ekstraSil = (index) => {
    setEkstralar(ekstralar.filter((_, i) => i !== index));
  };

  const onKaydet = (e) => {
    e.preventDefault();
    if (!duzenlenecekAd.trim()) return;

    handleUrunGuncelle(urun.id, {
      urun_adi: duzenlenecekAd,
      fiyat: Number(duzenlenecekFiyat),
      kategori: duzenlenecekKategori,
      aciklama: duzenlenecekAciklama,
      gorsel_url: duzenlenecekGorsel,
      porsiyonlar: porsiyonlar.filter((p) => p.ad.trim() !== ''),
      porsiyonZorunlu: porsiyonZorunlu,
      ekstralar: ekstralar.filter((e) => e.ad.trim() !== ''),
      ekstraZorunlu: ekstraZorunlu,
    });
    setDuzenlemeModu(false);
  };

  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3"
      style={{ opacity: urun.aktif_mi !== false ? 1 : 0.6 }}
    >
      <div className="p-3 d-flex align-items-center justify-content-between bg-white">
        <div className="d-flex align-items-center gap-3">
          <img
            src={urun.gorsel_url || '/resimler/varsayilan_yemek.png'}
            alt={urun.urun_adi}
            className="rounded-3 border"
            style={{ width: 65, height: 65, objectFit: 'cover' }}
          />

          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="fw-bold m-0 text-dark">{urun.urun_adi}</h6>
              <span className="badge bg-light text-dark border">{urun.kategori || 'Diğer'}</span>
            </div>
            {urun.aciklama && <small className="text-muted d-block mt-1">{urun.aciklama}</small>}
            <strong className="text-success fs-6 mt-1 d-block">{urun.fiyat} TL</strong>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={() => handleDurumDegistir(urun.id, urun.aktif_mi !== false)}
            className={`btn btn-sm fw-bold rounded-3 ${
              urun.aktif_mi !== false ? 'btn-outline-warning' : 'btn-outline-success'
            }`}
          >
            {urun.aktif_mi !== false ? 'Tükendi Yap' : 'Aktif Et'}
          </button>
          <button
            onClick={() => setDuzenlemeModu(!duzenlemeModu)}
            className="btn btn-light border btn-sm fw-bold rounded-3"
          >
            {duzenlemeModu ? 'İptal' : 'Düzenle'}
          </button>
          <button
            onClick={() => handleUrunSil(urun.id)}
            className="btn btn-outline-danger btn-sm border-0 fw-bold"
          >
            Sil
          </button>
        </div>
      </div>

     
      {duzenlemeModu && (
        <div className="p-4 bg-light border-top">
          <form onSubmit={onKaydet}>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="small fw-bold text-dark mb-1">Ürün Adı</label>
                <input
                  type="text"
                  required
                  className="form-control rounded-3"
                  value={duzenlenecekAd}
                  onChange={(e) => setDuzenlenecekAd(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="small fw-bold text-dark mb-1">Fiyat (TL)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="form-control rounded-3"
                  value={duzenlenecekFiyat}
                  onChange={(e) => setDuzenlenecekFiyat(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="small fw-bold text-dark mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  className="form-control rounded-3"
                  value={duzenlenecekKategori}
                  onChange={(e) => setDuzenlenecekKategori(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="small fw-bold text-dark mb-1">Açıklama</label>
                <textarea
                  rows="2"
                  className="form-control rounded-3"
                  value={duzenlenecekAciklama}
                  onChange={(e) => setDuzenlenecekAciklama(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="small fw-bold text-dark mb-1">Görsel Değiştir</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGorselSecimi}
                  className="form-control rounded-3"
                />
                {duzenlenecekGorsel && (
                  <div className="mt-2">
                    <img
                      src={duzenlenecekGorsel}
                      alt="Görsel Önizleme"
                      className="rounded-3 border shadow-sm"
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            </div>

            
            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-dark">Porsiyon / Boyut Seçenekleri</span>
                <button
                  type="button"
                  onClick={porsiyonEkle}
                  className="btn btn-outline-success btn-sm rounded-3 fw-bold"
                >
                  + Porsiyon Ekle
                </button>
              </div>

              {porsiyonlar.length > 0 && (
                <div className="form-check form-switch bg-white p-2.5 rounded-3 border mb-2 ms-0 d-flex align-items-center gap-2">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="checkbox"
                    id={`porsiyonZorunluCard_${urun.id}`}
                    checked={porsiyonZorunlu}
                    onChange={(e) => setPorsiyonZorunlu(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-dark m-0" htmlFor={`porsiyonZorunluCard_${urun.id}`}>
                    Porsiyon Seçimi Zorunlu Olsun
                  </label>
                </div>
              )}

              {porsiyonlar.map((item, idx) => (
                <div key={idx} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Porsiyon Adı"
                    value={item.ad}
                    onChange={(e) => porsiyonGuncelle(idx, 'ad', e.target.value)}
                    className="form-control form-control-sm rounded-2 flex-grow-1"
                  />
                  <input
                    type="number"
                    placeholder="Fiyat Farkı (+TL)"
                    value={item.fiyatFarki}
                    onChange={(e) => porsiyonGuncelle(idx, 'fiyatFarki', e.target.value)}
                    className="form-control form-control-sm rounded-2"
                    style={{ width: 130 }}
                  />
                  <button
                    type="button"
                    onClick={() => porsiyonSil(idx)}
                    className="btn btn-outline-danger btn-sm rounded-2 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            
            <div className="border-top pt-3 mt-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small text-dark">Ekstra Malzeme Seçenekleri</span>
                <button
                  type="button"
                  onClick={ekstraEkle}
                  className="btn btn-outline-primary btn-sm rounded-3 fw-bold"
                >
                  + Ekstra Ekle
                </button>
              </div>

              {ekstralar.length > 0 && (
                <div className="form-check form-switch bg-white p-2.5 rounded-3 border mb-2 ms-0 d-flex align-items-center gap-2">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="checkbox"
                    id={`ekstraZorunluCard_${urun.id}`}
                    checked={ekstraZorunlu}
                    onChange={(e) => setEkstraZorunlu(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-dark m-0" htmlFor={`ekstraZorunluCard_${urun.id}`}>
                    Ekstra Seçimi Zorunlu Olsun
                  </label>
                </div>
              )}

              {ekstralar.map((item, idx) => (
                <div key={idx} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ekstra Adı"
                    value={item.ad}
                    onChange={(e) => ekstraGuncelle(idx, 'ad', e.target.value)}
                    className="form-control form-control-sm rounded-2 flex-grow-1"
                  />
                  <input
                    type="number"
                    placeholder="Fiyat Farkı (+TL)"
                    value={item.fiyatFarki}
                    onChange={(e) => ekstraGuncelle(idx, 'fiyatFarki', e.target.value)}
                    className="form-control form-control-sm rounded-2"
                    style={{ width: 130 }}
                  />
                  <button
                    type="button"
                    onClick={() => ekstraSil(idx)}
                    className="btn btn-outline-danger btn-sm rounded-2 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                onClick={() => setDuzenlemeModu(false)}
                className="btn btn-light btn-sm rounded-2 fw-bold"
              >
                Vazgeç
              </button>
              <button type="submit" className="btn btn-success btn-sm fw-bold rounded-2 px-4">
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}