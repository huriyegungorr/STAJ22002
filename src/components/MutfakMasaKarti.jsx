import MutfakSiparisItem from './MutfakSiparisItem';

export default function MutfakMasaKarti({ masa, onIptalBaslat }) {
  return (
    <div className="col">
      <div className="card mutfak-card h-100 shadow-sm border-0 rounded-4">
        <div className="mutfak-card-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shop fs-5 text-success"></i>
            <span className="fs-5 fw-bold text-dark">{masa.ad || masa.name}</span>
          </div>
          <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-3">
            {masa.alan || 'Salon'}
          </span>
        </div>

        <div className="card-body p-3">
          <div className="d-flex flex-column gap-2">
            {masa.adisyon.map((item, index) => (
              <MutfakSiparisItem
                key={index}
                masa={masa}
                item={item}
                index={index}
                onIptalBaslat={onIptalBaslat}
              />
            ))}
          </div>
        </div>

        <div
          className="card-footer bg-white border-top text-muted text-center py-2"
          style={{ fontSize: 11 }}
        >
          <i className="bi bi-broadcast me-1 text-success"></i> Canlı Mutfak Takibi
        </div>
      </div>
    </div>
  );
}