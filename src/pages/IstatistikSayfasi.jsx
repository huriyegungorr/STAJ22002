import { useState, useEffect } from 'react';
import statsService from '../services/statsService';

export default function IstatistikSayfasi() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function yukle() {
      setLoading(true);
      const veri = await statsService.getIstatistikler();
      setStats(veri);
      setLoading(false);
    }
    yukle();
  }, []);

  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">

      <div className="flex-grow-1 d-flex flex-column h-100 overflow-auto">
       

        <main className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h5 className="fw-bold m-0 text-dark">Raporlar & İstatistikler</h5>
              <small className="text-muted">İşletmenizin ciro, sipariş ve ürün performans özeti.</small>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : (
            <>
              
              <div className="row g-4 mb-4">
                
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <span className="text-muted small fw-bold d-block mb-1">BUGÜNKÜ CİRO</span>
                    <h3 className="fw-bold text-success m-0">{stats?.bugunkuCiro || 0} TL</h3>
                    <small className="text-muted mt-2 d-block" style={{ fontSize: 11 }}>
                      Bugün kapatılan adisyonlar
                    </small>
                  </div>
                </div>

                
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <span className="text-muted small fw-bold d-block mb-1">BUGÜNKÜ SİPARİŞ</span>
                    <h3 className="fw-bold text-dark m-0">{stats?.bugunkuSiparisSayisi || 0} Adet</h3>
                    <small className="text-muted mt-2 d-block" style={{ fontSize: 11 }}>
                      Bugün kapatılan masa sayısı
                    </small>
                  </div>
                </div>

               
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <span className="text-muted small fw-bold d-block mb-1">TOPLAM CİRO</span>
                    <h3 className="fw-bold text-primary m-0">{stats?.toplamCiro || 0} TL</h3>
                    <small className="text-muted mt-2 d-block" style={{ fontSize: 11 }}>
                      Tüm zamanlar ({stats?.toplamSiparisSayisi || 0} Satış)
                    </small>
                  </div>
                </div>

                
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <span className="text-muted small fw-bold d-block mb-1">MASA DOLULUK ORANI</span>
                    <h3 className="fw-bold text-warning m-0">%{stats?.dolulukOrani || 0}</h3>
                    <small className="text-muted mt-2 d-block" style={{ fontSize: 11 }}>
                      {stats?.doluMasaSayisi || 0} / {stats?.toplamMasaSayisi || 0} masa aktif
                    </small>
                  </div>
                </div>
              </div>

              
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <h6 className="fw-bold text-dark border-bottom pb-3 mb-3">
                      <i className="bi bi-trophy text-warning me-2"></i>En Çok Satan Ürünler
                    </h6>

                    {(!stats?.populerUrunler || stats.populerUrunler.length === 0) ? (
                      <div className="text-center text-muted py-4 small">Henüz ürün satış verisi bulunmuyor.</div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {stats.populerUrunler.map((urun, index) => (
                          <div key={index} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                            <div className="d-flex align-items-center gap-3">
                              <span className="badge bg-success rounded-circle p-2" style={{ width: 28, height: 28 }}>
                                {index + 1}
                              </span>
                              <span className="fw-bold text-dark small">{urun.ad}</span>
                            </div>
                            <span className="badge bg-white text-dark border fw-bold px-3 py-2">
                              {urun.adet} Satış
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}