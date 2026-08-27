import { useState } from 'react';

export default function ProductModal({
  acikMi,
  kapat,
  seciliKategori, 
  handleUrunEkle,
  yukleniyor,
}) {
  const [urunAdi, setUrunAdi] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [gorselUrl, setGorselUrl] = useState('');

  const [porsiyonlar, setPorsiyonlar] = useState([]);
  const [porsiyonZorunlu, setPorsiyonZorunlu] = useState(false);

  const [ekstralar, setEkstralar] = useState([]);
  const [ekstraZorunlu, setEkstraZorunlu] = useState(false);

  if (!acikMi) return null;

  const handleGorselSec = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGorselUrl(reader.result);
      };
      reader.readAsDataURL(file);
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

  const onSubmit = async (e) => {
    e.preventDefault();

    const gecerliPorsiyonlar = porsiyonlar.filter((p) => p.ad.trim() !== '');
    const gecerliEkstralar = ekstralar.filter((e) => e.ad.trim() !== '');

    await handleUrunEkle({
      urun_adi: urunAdi.trim(),
      fiyat: Number(fiyat),
      aciklama: aciklama.trim(),
      gorsel_url: gorselUrl,
      kategoriId: seciliKategori?.id || '', 
      kategori: seciliKategori?.ad || 'Genel',
      porsiyonlar: gecerliPorsiyonlar,
      porsiyonZorunlu: porsiyonZorunlu, 
      ekstralar: gecerliEkstralar,
      ekstraZorunlu: ekstraZorunlu,     
      durum: true,
    });

    setUrunAdi('');
    setFiyat('');
    setAciklama('');
    setGorselUrl('');
    setPorsiyonlar([]);
    setPorsiyonZorunlu(false);
    setEkstralar([]);
    setEkstraZorunlu(false);
    kapat();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-dark">
              <span className="text-success">"{seciliKategori?.ad}"</span> Kategorisine Ürün Ekle
            </h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Ürün Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Burger Menü"
                    value={urunAdi}
                    onChange={(e) => setUrunAdi(e.target.value)}
                    className="form-control rounded-3"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Taban Fiyat (TL)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Örn: 180"
                    value={fiyat}
                    onChange={(e) => setFiyat(e.target.value)}
                    className="form-control rounded-3"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-dark">Ürün Açıklaması / İçerik</label>
                  <textarea
                    rows="2"
                    placeholder="Örn: 150gr dana köfte, karamelize soğan, cheddar peyniri ve özel sos ile."
                    value={aciklama}
                    onChange={(e) => setAciklama(e.target.value)}
                    className="form-control rounded-3"
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-dark">Ürün Görseli</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGorselSec}
                    className="form-control rounded-3"
                  />
                  {gorselUrl && (
                    <div className="mt-2 text-center">
                      <img
                        src={gorselUrl}
                        alt="Önizleme"
                        className="rounded-3 border shadow-sm"
                        style={{ width: 80, height: 80, objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                <div className="col-12 border-top pt-3 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <label className="form-label small fw-bold m-0 text-dark">1. Porsiyon / Boyut Seçenekleri</label>
                      <small className="text-muted d-block" style={{ fontSize: 11 }}>
                        Örn: Küçük Boy (+0 TL), Orta Boy (+20 TL), Büyük Boy (+40 TL)
                      </small>
                    </div>
                    <button
                      type="button"
                      onClick={porsiyonEkle}
                      className="btn btn-outline-success btn-sm rounded-3 fw-bold"
                    >
                      + Porsiyon Ekle
                    </button>
                  </div>

                  {porsiyonlar.length > 0 && (
                    <div className="form-check form-switch bg-light p-2.5 rounded-3 border mb-2 ms-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input ms-0 me-2"
                        type="checkbox"
                        id="porsiyonZorunluCheck"
                        checked={porsiyonZorunlu}
                        onChange={(e) => setPorsiyonZorunlu(e.target.checked)}
                      />
                      <label className="form-check-label small fw-bold text-dark m-0" htmlFor="porsiyonZorunluCheck">
                        Porsiyon Seçimi Zorunlu Olsun
                      </label>
                    </div>
                  )}

                  {porsiyonlar.map((item, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Porsiyon Adı"
                        value={item.ad}
                        onChange={(e) => porsiyonGuncelle(index, 'ad', e.target.value)}
                        className="form-control form-control-sm rounded-2 flex-grow-1"
                      />
                      <input
                        type="number"
                        placeholder="Fiyat Farkı (+TL)"
                        value={item.fiyatFarki}
                        onChange={(e) => porsiyonGuncelle(index, 'fiyatFarki', e.target.value)}
                        className="form-control form-control-sm rounded-2"
                        style={{ width: 140 }}
                      />
                      <button
                        type="button"
                        onClick={() => porsiyonSil(index)}
                        className="btn btn-outline-danger btn-sm rounded-2 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="col-12 border-top pt-3 mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <label className="form-label small fw-bold m-0 text-dark">2. Ekstra Malzeme Seçenekleri</label>
                      <small className="text-muted d-block" style={{ fontSize: 11 }}>
                        Örn: Ekstra Peynir (+15 TL), Ekstra Sos (+5 TL)
                      </small>
                    </div>
                    <button
                      type="button"
                      onClick={ekstraEkle}
                      className="btn btn-outline-primary btn-sm rounded-3 fw-bold"
                    >
                      + Ekstra Ekle
                    </button>
                  </div>

                  {ekstralar.length > 0 && (
                    <div className="form-check form-switch bg-light p-2.5 rounded-3 border mb-2 ms-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input ms-0 me-2"
                        type="checkbox"
                        id="ekstraZorunluCheck"
                        checked={ekstraZorunlu}
                        onChange={(e) => setEkstraZorunlu(e.target.checked)}
                      />
                      <label className="form-check-label small fw-bold text-dark m-0" htmlFor="ekstraZorunluCheck">
                        Ekstra Seçimi Zorunlu Olsun
                      </label>
                    </div>
                  )}

                  {ekstralar.map((item, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Ekstra Adı"
                        value={item.ad}
                        onChange={(e) => ekstraGuncelle(index, 'ad', e.target.value)}
                        className="form-control form-control-sm rounded-2 flex-grow-1"
                      />
                      <input
                        type="number"
                        placeholder="Fiyat Farkı (+TL)"
                        value={item.fiyatFarki}
                        onChange={(e) => ekstraGuncelle(index, 'fiyatFarki', e.target.value)}
                        className="form-control form-control-sm rounded-2"
                        style={{ width: 140 }}
                      />
                      <button
                        type="button"
                        onClick={() => ekstraSil(index)}
                        className="btn btn-outline-danger btn-sm rounded-2 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer border-top p-3">
              <button type="button" onClick={kapat} className="btn btn-light rounded-3 fw-bold">
                İptal
              </button>
              <button type="submit" disabled={yukleniyor} className="btn btn-success rounded-3 fw-bold px-4">
                {yukleniyor ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}