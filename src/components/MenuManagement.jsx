import { useState } from 'react';
import { usePos } from '../context/PosContext';
import menuService from '../services/menuService';

import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function MenuManagement() {
  const { urunler, kategoriler } = usePos();

  const [seciliKategoriId, setSeciliKategoriId] = useState(null);
  const [modalAcik, setModalAcik] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const aktifKategori = kategoriler.find((k) => k.id === seciliKategoriId) || kategoriler[0] || null;

  const filtrelenmisUrunler = urunler.filter((u) => {
    if (!aktifKategori) return true;
    return u.kategoriId === aktifKategori.id || u.kategori === aktifKategori.ad;
  });

  const onUrunEkleSubmit = async (yeniUrun) => {
    setYukleniyor(true);
    await menuService.handleUrunEkle(yeniUrun);
    setYukleniyor(false);
  };

  return (
    <div className="w-100 d-flex flex-column gap-1">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h5 className="fw-bold m-0 text-dark">Kategori ve Ürün Listesi</h5>
          <small className="text-muted">Toplam {urunler.length} ürün sistemde kayıtlı</small>
        </div>
        {aktifKategori && (
          <button
            onClick={() => setModalAcik(true)}
            className="btn btn-success btn-sm fw-bold rounded-3 px-3 py-2 shadow-sm d-flex align-items-center gap-1 flex-shrink-0"
          >
            <i className="bi bi-plus-circle-fill me-1"></i>
            <span>"{aktifKategori.ad}" Kategorisine Ürün Ekle</span>
          </button>
        )}
      </div>

      <CategoryFilter
        kategoriler={kategoriler}
        seciliKategori={aktifKategori}
        setSeciliKategori={(kat) => setSeciliKategoriId(kat?.id || null)}
        urunler={urunler}
        handleKategoriEkle={menuService.handleKategoriEkle}
        handleKategoriGuncelle={menuService.handleKategoriGuncelle}
        handleKategoriSil={menuService.handleKategoriSil}
      />

      {filtrelenmisUrunler.length === 0 ? (
        <div className="card border-dashed-custom p-5 text-center text-muted rounded-4 bg-white my-4">
          <i className="bi bi-cup-hot fs-1 text-secondary mb-2 d-block"></i>
          <strong>"{aktifKategori?.ad}"</strong> kategorisinde henüz ürün bulunmuyor.
          <br />
          <button
            onClick={() => setModalAcik(true)}
            className="btn btn-success btn-sm rounded-3 fw-bold mt-3 px-3 py-2"
          >
            <i className="bi bi-plus-lg me-1"></i> İlk Ürünü Ekle
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 g-3 mt-2">
          {filtrelenmisUrunler.map((urun) => (
            <div key={urun.id} className="col">
              <ProductCard
                urun={urun}
                handleDurumDegistir={menuService.handleDurumDegistir}
                handleUrunSil={menuService.handleUrunSil}
                handleUrunGuncelle={menuService.handleUrunGuncelle}
              />
            </div>
          ))}
        </div>
      )}

      <ProductModal
        acikMi={modalAcik}
        kapat={() => setModalAcik(false)}
        seciliKategori={aktifKategori}
        handleUrunEkle={onUrunEkleSubmit}
        yukleniyor={yukleniyor}
      />
    </div>
  );
}