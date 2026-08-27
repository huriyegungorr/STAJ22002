import { useState } from 'react';

export default function OdemeModali({ toplamTutar, kapat, onOdemeOnay, yukleniyor }) {
  const [odemeSekli, setOdemeSekli] = useState('tekil'); 
  
  const [odemeTipi, setOdemeTipi] = useState('Nakit');

  const [nakitTutar, setNakitTutar] = useState('');
  const [kartTutar, setKartTutar] = useState('');
  const [yemekKartiTutar, setYemekKartiTutar] = useState('');

 
  const girilenToplam =
    (Number(nakitTutar) || 0) +
    (Number(kartTutar) || 0) +
    (Number(yemekKartiTutar) || 0);

  const kalanTutar = toplamTutar - girilenToplam;

  const handleOnay = () => {
    if (odemeSekli === 'tekil') {
     
      onOdemeOnay({
        tamamlandi: true,
        odemeSekli: 'tekil',
        odemeTipi: odemeTipi,
        toplamTutar: toplamTutar,
        detay: [{ tip: odemeTipi, tutar: toplamTutar }],
      });
    } else {
      
      if (kalanTutar !== 0) {
        alert(
          kalanTutar > 0
            ? `Eksik tutar girdiniz! Kalan: ${kalanTutar} TL`
            : `Fazla tutar girdiniz! Fazla: ${Math.abs(kalanTutar)} TL`
        );
        return;
      }

      const odemeDetayi = [];
      if (Number(nakitTutar) > 0) odemeDetayi.push({ tip: 'Nakit', tutar: Number(nakitTutar) });
      if (Number(kartTutar) > 0) odemeDetayi.push({ tip: 'Kredi Kartı', tutar: Number(kartTutar) });
      if (Number(yemekKartiTutar) > 0) odemeDetayi.push({ tip: 'Yemek Kartı', tutar: Number(yemekKartiTutar) });

      onOdemeOnay({
        tamamlandi: true,
        odemeSekli: 'parcali',
        toplamTutar: toplamTutar,
        detay: odemeDetayi,
      });
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-dark">
              Hesap Kapat & Ödeme Al
            </h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <div className="modal-body p-4">
           
            <div className="text-center mb-3 p-3 bg-light rounded-4">
              <small className="text-muted fw-semibold d-block">Ödenecek Toplam Tutar</small>
              <span className="fs-1 fw-bold text-success">{toplamTutar} TL</span>
            </div>

          
            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                onClick={() => setOdemeSekli('tekil')}
                className={`btn py-2 fw-bold ${
                  odemeSekli === 'tekil' ? 'btn-dark' : 'btn-outline-dark'
                }`}
              >
                Tek Ödeme
              </button>
              <button
                type="button"
                onClick={() => setOdemeSekli('parcali')}
                className={`btn py-2 fw-bold ${
                  odemeSekli === 'parcali' ? 'btn-dark' : 'btn-outline-dark'
                }`}
              >
                Parçalı / Bölerek Öde
              </button>
            </div>

           
            {odemeSekli === 'tekil' ? (
              <div className="d-flex flex-column gap-2 mb-3">
                {[
                  { id: 'Nakit', baslik: 'Nakit Ödeme', icon: 'bi-cash-stack' },
                  { id: 'Kredi Kartı', baslik: 'Kredi / Banka Kartı', icon: 'bi-credit-card-2-front' },
                  { id: 'Yemek Kartı', baslik: 'Yemek Kartı', icon: 'bi-card-heading' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOdemeTipi(item.id)}
                    className={`btn w-100 text-start d-flex align-items-center justify-content-between p-3 rounded-3 border ${
                      odemeTipi === item.id
                        ? 'btn-dark text-white fw-bold'
                        : 'btn-light text-dark'
                    }`}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon} fs-5`}></i>
                      {item.baslik}
                    </span>
                    {odemeTipi === item.id && <i className="bi bi-check-circle-fill"></i>}
                  </button>
                ))}
              </div>
            ) : (
              
              <div className="d-flex flex-column gap-3 mb-3">
                <div>
                  <label className="small fw-bold text-muted mb-1">Nakit Ödenen (TL)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={nakitTutar}
                    onChange={(e) => setNakitTutar(e.target.value)}
                    className="form-control rounded-3 py-2"
                  />
                </div>

                <div>
                  <label className="small fw-bold text-muted mb-1">Kredi Kartı Ödenen (TL)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={kartTutar}
                    onChange={(e) => setKartTutar(e.target.value)}
                    className="form-control rounded-3 py-2"
                  />
                </div>

                <div>
                  <label className="small fw-bold text-muted mb-1">Yemek Kartı Ödenen (TL)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={yemekKartiTutar}
                    onChange={(e) => setYemekKartiTutar(e.target.value)}
                    className="form-control rounded-3 py-2"
                  />
                </div>

                
                <div
                  className={`alert border-0 rounded-3 p-2 text-center fw-bold small m-0 ${
                    kalanTutar === 0
                      ? 'alert-success'
                      : kalanTutar > 0
                      ? 'alert-warning'
                      : 'alert-danger'
                  }`}
                >
                  {kalanTutar === 0
                    ? '✓ Tutar tam eşleşti, ödemeyi alabilirsiniz.'
                    : kalanTutar > 0
                    ? `Kalan Tutar: ${kalanTutar} TL`
                    : `Fazla Tutar: ${Math.abs(kalanTutar)} TL`}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-top p-3">
            <button type="button" onClick={kapat} className="btn btn-light rounded-3 fw-bold">
              İptal
            </button>
            <button
              type="button"
              disabled={yukleniyor || (odemeSekli === 'parcali' && kalanTutar !== 0)}
              onClick={handleOnay}
              className="btn btn-success rounded-3 fw-bold px-4 py-2"
            >
              {yukleniyor ? 'Tamamlanıyor...' : 'Ödemeyi Onayla ve Kapat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}