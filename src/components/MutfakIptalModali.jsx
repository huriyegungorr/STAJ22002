import { useState } from 'react';

export default function MutfakIptalModali({ acikMi, iptalHedef, kapat, onOnayla }) {
  const [seciliSebep, setSeciliSebep] = useState('Malzeme Tükendi');
  const [ozelSebep, setOzelSebep] = useState('');

  const hazirSebepler = [
    'Malzeme Tükendi',
    'Müşteri Vazgeçti',
    'Yanlış Giriş Yapıldı',
    'Mutfak Yoğunluğu',
  ];

  if (!acikMi || !iptalHedef) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const nihaiNot = ozelSebep.trim() ? ozelSebep.trim() : seciliSebep;
    onOnayla(nihaiNot);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>Siparişi İptal Et</span>
            </h5>
            <button type="button" className="btn-close" onClick={kapat}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <p className="text-dark fw-bold mb-3">
                <span className="text-danger">"{iptalHedef.urunAdi}"</span> siparişinin iptal sebebini seçin:
              </p>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {hazirSebepler.map((sebep, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSeciliSebep(sebep);
                      setOzelSebep('');
                    }}
                    className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold transition ${
                      seciliSebep === sebep && !ozelSebep
                        ? 'btn-danger text-white'
                        : 'btn-light border text-dark'
                    }`}
                  >
                    {sebep}
                  </button>
                ))}
              </div>

              <div>
                <label className="form-label small fw-bold text-muted">
                  Veya Özel Bir Sebep / Not Yazın:
                </label>
                <input
                  type="text"
                  placeholder="Örn: Müşteri çorbadan vazgeçti"
                  value={ozelSebep}
                  onChange={(e) => setOzelSebep(e.target.value)}
                  className="form-control rounded-3"
                />
              </div>
            </div>

            <div className="modal-footer border-top p-3">
              <button type="button" onClick={kapat} className="btn btn-light rounded-3 fw-bold">
                Vazgeç
              </button>
              <button type="submit" className="btn btn-danger rounded-3 fw-bold px-4">
                İptali Onayla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}