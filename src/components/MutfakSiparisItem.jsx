import kitchenService from '../services/kitchenService';

export default function MutfakSiparisItem({ masa, item, index, onIptalBaslat }) {
  const isIptal = item.mutfakDurumu === 'iptal';
  const isHazir = item.mutfakDurumu === 'hazir';
  const isHazirlaniyor = item.mutfakDurumu === 'hazirlaniyor';

  return (
    <div
      className={`mutfak-item d-flex align-items-center justify-content-between p-2 rounded-3 border ${
        isIptal ? 'bg-danger-subtle border-danger-subtle opacity-75' : 'bg-light'
      }`}
    >
      <div className="me-2">
        <div
          className={`fw-bold fs-6 d-flex align-items-center gap-2 ${
            isIptal ? 'text-decoration-line-through text-danger' : 'text-dark'
          }`}
        >
          <span className="mutfak-item-adet badge bg-white border text-dark">
            {item.adet}x
          </span>
          <span>{item.urun_adi}</span>
        </div>

        {(item.seciliPorsiyon || item.seciliSos || item.ozelNot) && (
          <div className="mt-1">
            {item.seciliPorsiyon && (
              <span className="badge bg-white text-secondary border me-1">
                {item.seciliPorsiyon}
              </span>
            )}
            {item.seciliSos && (
              <span className="badge bg-white text-secondary border me-1">
                {item.seciliSos}
              </span>
            )}
            {item.ozelNot && (
              <div className="mutfak-not-badge text-warning-emphasis small">
                <i className="bi bi-exclamation-circle me-1"></i>
                Not: {item.ozelNot}
              </div>
            )}
          </div>
        )}

        {isIptal && (
          <div className="text-danger fw-bold small mt-1">
            <i className="bi bi-x-circle me-1"></i>
            İptal Sebebi: {item.iptalNotu}
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-1 flex-shrink-0">
        {isIptal ? (
          <span className="badge bg-danger text-white py-2 px-3 fw-bold rounded-3">
            İptal Edildi
          </span>
        ) : isHazir ? (
          <span className="badge bg-success text-white py-2 px-3 fw-bold rounded-3">
            <i className="bi bi-check-all me-1"></i> Hazır
          </span>
        ) : (
          <>
            {isHazirlaniyor ? (
              <button
                onClick={() =>
                  kitchenService.handleMutfakDurumGuncelle(
                    masa.id,
                    masa.adisyon,
                    index,
                    'hazir'
                  )
                }
                className="btn btn-success btn-sm fw-bold px-3 py-1.5 rounded-3 shadow-sm"
              >
                Hazır Et
              </button>
            ) : (
              <button
                onClick={() =>
                  kitchenService.handleMutfakDurumGuncelle(
                    masa.id,
                    masa.adisyon,
                    index,
                    'hazirlaniyor'
                  )
                }
                className="btn btn-outline-success btn-sm px-3 py-1.5 rounded-3"
              >
                Başla
              </button>
            )}

            <button
              onClick={() => onIptalBaslat(masa.id, masa.adisyon, index, item.urun_adi)}
              className="btn btn-outline-danger btn-sm px-2 py-1.5 rounded-3"
              title="Siparişi İptal Et"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
}