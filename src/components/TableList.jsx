import { useState } from 'react';
import tableService from '../services/tableService'; 
import TableModal from './TableModal';
import TableCard from './TableCard';

export default function TableList({
  alanlar,
  seciliAlan,
  setSeciliAlan,
  masalar,
  filtrelenmisMasalar,
  rezervasyonlar = [],
  yukleniyor,
}) {
  const [yeniAlanAd, setYeniAlanAd] = useState('');
  const [inputGoster, setInputGoster] = useState(false);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekAd, setDuzenlenecekAd] = useState('');

  const [modalAcik, setModalAcik] = useState(false);

  const onAlanEkle = (e) => {
    e.preventDefault();
    if (!yeniAlanAd.trim()) return;
    tableService.handleAlanEkle(yeniAlanAd.trim()); 
    setYeniAlanAd('');
    setInputGoster(false);
  };

  const onAlanGuncelle = (e) => {
    e.preventDefault();
    if (!duzenlenecekAd.trim()) return;
    tableService.handleAlanGuncelle(seciliAlan.id, duzenlenecekAd.trim()); 
    setDuzenlemeModu(false);
  };

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        
        <div className="d-flex flex-wrap align-items-center gap-2">
          {alanlar.map((alan) => {
            const adet = masalar.filter((m) => (m.alan || 'Salon') === alan.ad).length;
            return (
              <button
                key={alan.id}
                onClick={() => {
                  setSeciliAlan(alan);
                  setDuzenlemeModu(false);
                }}
                className={`btn btn-sm fw-bold rounded-3 px-3 py-2 transition ${
                  seciliAlan?.id === alan.id ? 'btn-dark' : 'btn-white border text-secondary'
                }`}
              >
                {alan.ad} ({adet})
              </button>
            );
          })}

          {!inputGoster ? (
            <button
              onClick={() => setInputGoster(true)}
              className="btn btn-outline-success btn-sm fw-bold rounded-3 px-3 py-2"
            >
              <i className="bi bi-plus-lg me-1"></i> Yeni Alan Ekle
            </button>
          ) : (
            <form onSubmit={onAlanEkle} className="d-flex align-items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Alan adı"
                value={yeniAlanAd}
                onChange={(e) => setYeniAlanAd(e.target.value)}
                className="form-control form-control-sm rounded-3"
                style={{ width: 140 }}
              />
              <button type="submit" className="btn btn-success btn-sm rounded-3 fw-bold">
                Kaydet
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

       
        <div className="d-flex align-items-center gap-2">
          {seciliAlan && (
            <button
              onClick={() => setModalAcik(true)}
              className="btn btn-success btn-sm fw-bold rounded-3 px-3 py-2 shadow-sm d-flex align-items-center gap-1"
            >
              <i className="bi bi-plus-circle-fill me-1"></i>
              <span>"{seciliAlan.ad}" Alanına Masa Ekle</span>
            </button>
          )}

          {seciliAlan && !duzenlemeModu ? (
            <>
              <button
                onClick={() => {
                  setDuzenlenecekAd(seciliAlan.ad);
                  setDuzenlemeModu(true);
                }}
                className="btn btn-light border btn-sm text-secondary rounded-3 px-2.5 py-2"
                title="Alanı Düzenle"
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                onClick={() => tableService.handleAlanSil(seciliAlan.id, seciliAlan.ad)}
                className="btn btn-outline-danger btn-sm rounded-3 px-2.5 py-2"
                title="Alanı Sil"
              >
                <i className="bi bi-trash"></i>
              </button>
            </>
          ) : duzenlemeModu ? (
            <form onSubmit={onAlanGuncelle} className="d-flex align-items-center gap-2">
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
      </div>

      
{filtrelenmisMasalar.length === 0 ? (
        <div className="card border-dashed p-5 text-center text-muted rounded-4 bg-white">
          <i className="bi bi-grid-3x3-gap fs-1 text-secondary mb-2 d-block"></i>
          <strong>"{seciliAlan?.ad}"</strong> alanında henüz kayıtlı masa bulunmuyor.
          <br />
          <button
            onClick={() => setModalAcik(true)}
            className="btn btn-success btn-sm rounded-3 fw-bold mt-3 px-3 py-2"
          >
            <i className="bi bi-plus-lg me-1"></i> İlk Masayı Ekle
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
          {filtrelenmisMasalar.map((masa) => (
            <TableCard
              key={masa.id}
              masa={masa}
              rezervasyonlar={rezervasyonlar} 
              handleMasaSil={tableService.handleMasaSil}
              handleMasaGuncelle={tableService.handleMasaGuncelle}
            />
          ))}
        </div>
      )}

    
     <TableModal
        acikMi={modalAcik}
        kapat={() => setModalAcik(false)}
        seciliAlan={seciliAlan}
        handleMasaEkle={tableService.handleMasaEkle}
        yukleniyor={yukleniyor}
      />
    </div>
  );
}