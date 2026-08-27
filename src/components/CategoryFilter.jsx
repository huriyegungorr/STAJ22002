import { useState } from 'react';

export default function CategoryFilter({
  kategoriler,
  seciliKategori,
  setSeciliKategori,
  urunler,
  handleKategoriEkle,
  handleKategoriGuncelle,
  handleKategoriSil,
}) {
  const [yeniKategoriAdi, setYeniKategoriAdi] = useState('');
  const [inputGoster, setInputGoster] = useState(false);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekAd, setDuzenlenecekAd] = useState('');

  const onKategoriEkle = (e) => {
    e.preventDefault();
    if (!yeniKategoriAdi.trim()) return;
    handleKategoriEkle(yeniKategoriAdi.trim());
    setYeniKategoriAdi('');
    setInputGoster(false);
  };

  const onKategoriGuncelle = (e) => {
    e.preventDefault();
    if (!duzenlenecekAd.trim()) return;
    handleKategoriGuncelle(seciliKategori.id, duzenlenecekAd.trim());
    setDuzenlemeModu(false);
  };

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
      <div className="d-flex flex-wrap align-items-center gap-2">
        {kategoriler.map((kat) => {
          const adet = urunler.filter((u) => u.kategori === kat.ad).length;
          return (
            <button
              key={kat.id}
              onClick={() => {
                setSeciliKategori(kat);
                setDuzenlemeModu(false);
              }}
              className={`btn btn-sm fw-bold rounded-3 px-3 py-2 ${
                seciliKategori?.id === kat.id ? 'btn-dark' : 'btn-white border text-secondary'
              }`}
            >
              {kat.ad} ({adet})
            </button>
          );
        })}

        {!inputGoster ? (
          <button
            onClick={() => setInputGoster(true)}
            className="btn btn-outline-success btn-sm fw-bold rounded-3 px-3 py-2"
          >
            <i className="bi bi-plus-lg me-1"></i> Kategori Ekle
          </button>
        ) : (
          <form onSubmit={onKategoriEkle} className="d-flex align-items-center gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Kategori Adı"
              value={yeniKategoriAdi}
              onChange={(e) => setYeniKategoriAdi(e.target.value)}
              className="form-control form-control-sm rounded-3"
              style={{ width: 140 }}
            />
            <button type="submit" className="btn btn-success btn-sm rounded-3 fw-bold">
              Ekle
            </button>
            <button
              type="button"
              onClick={() => setInputGoster(false)}
              className="btn btn-light btn-sm rounded-3"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </form>
        )}
      </div>

      {seciliKategori && !duzenlemeModu ? (
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => {
              setDuzenlenecekAd(seciliKategori.ad);
              setDuzenlemeModu(true);
            }}
            className="btn btn-light border btn-sm text-secondary rounded-3 px-2.5 py-2"
            title="Kategoriyi Düzenle"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            onClick={() => handleKategoriSil(seciliKategori.id, seciliKategori.ad)}
            className="btn btn-outline-danger btn-sm rounded-3 px-2.5 py-2"
            title="Kategoriyi Sil"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ) : duzenlemeModu ? (
        <form onSubmit={onKategoriGuncelle} className="d-flex align-items-center gap-2">
          <input
            type="text"
            autoFocus
            value={duzenlenecekAd}
            onChange={(e) => setDuzenlenecekAd(e.target.value)}
            className="form-control form-control-sm rounded-3"
            style={{ width: 130 }}
          />
          <button type="submit" className="btn btn-primary btn-sm rounded-3 fw-bold">
            Güncelle
          </button>
          <button
            type="button"
            onClick={() => setDuzenlemeModu(false)}
            className="btn btn-light btn-sm rounded-3"
          >
            İptal
          </button>
        </form>
      ) : null}
    </div>
  );
}