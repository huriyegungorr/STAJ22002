import { useState } from 'react';
import UrunOpsiyonModali from './UrunOpsiyonModali';

export default function OrderMenu({
  kategoriler,
  seciliKategori,
  setSeciliKategori,
  filtrelenmisUrunler,
  sepeteEkle,
}) {
  const [secilenUrunModal, setSecilenUrunModal] = useState(null);

  const handleUrunTikla = (urun) => {
    
    setSecilenUrunModal(urun);
  };

  return (
    <div className="col-md-8 p-4 d-flex flex-column h-100 bg-light overflow-y-auto">
     
      <div className="d-flex gap-2 pb-3 mb-3 border-bottom overflow-x-auto">
        <button
          onClick={() => setSeciliKategori('Tümü')}
          className={`btn fw-bold rounded-3 px-4 py-2 text-nowrap ${
            seciliKategori === 'Tümü'
              ? 'btn-dark'
              : 'btn-white border text-secondary'
          }`}
        >
          Tümü
        </button>
        {kategoriler.map((kat) => (
          <button
            key={kat.id}
            onClick={() => setSeciliKategori(kat.ad)}
            className={`btn fw-bold rounded-3 px-4 py-2 text-nowrap ${
              seciliKategori === kat.ad
                ? 'btn-dark'
                : 'btn-white border text-secondary'
            }`}
          >
            {kat.ad}
          </button>
        ))}
      </div>

     
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 pb-5">
        {filtrelenmisUrunler.map((urun) => (
          <div key={urun.id} className="col">
            <div
              onClick={() => handleUrunTikla(urun)}
              className="card border-0 shadow-sm rounded-4 h-100 p-3 text-center bg-white user-select-none"
              style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            >
              <img
                src={urun.gorsel_url || '/resimler/varsayilan_yemek.png'}
                alt={urun.urun_adi}
                className="rounded-3 mx-auto mb-2"
                style={{ width: 70, height: 70, objectFit: 'cover' }}
              />
              <h6 className="fw-bold text-dark m-0 small">{urun.urun_adi}</h6>
              <span className="text-success fw-bold mt-2 d-block">
                {urun.fiyat} TL
              </span>
            </div>
          </div>
        ))}
      </div>

      
      {secilenUrunModal && (
        <UrunOpsiyonModali
          urun={secilenUrunModal}
          kapat={() => setSecilenUrunModal(null)}
          onOnayla={(detayliUrun) => {
            sepeteEkle(detayliUrun);
          }}
        />
      )}
    </div>
  );
}