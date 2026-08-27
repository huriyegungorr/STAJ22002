import reservationService from '../services/reservationService';

export default function RezervasyonListesi({ rezervasyonlar, loading }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (rezervasyonlar.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-calendar-x fs-1 mb-2 d-block text-secondary"></i>
        Henüz kaydedilmiş bir rezervasyon bulunmuyor.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="ps-4">Müşteri</th>
            <th>Telefon</th>
            <th>Tarih & Saat</th>
            <th>Kişi</th>
            <th>Masa</th>
            <th>Not</th>
            <th>Durum</th>
            <th className="text-end pe-4">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {rezervasyonlar.map((rez) => (
            <tr key={rez.id}>
              <td className="ps-4 fw-bold text-dark">{rez.musteriAdi}</td>
              <td className="text-muted">{rez.telefon}</td>
              <td>
                <span className="fw-semibold">{rez.tarih}</span>
                <small className="text-muted ms-2">({rez.saat})</small>
              </td>
              <td><span className="badge bg-light text-dark border">{rez.kisiSayisi} Kişi</span></td>
              <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">{rez.masaAd}</span></td>
              <td><small className="text-muted">{rez.not || '-'}</small></td>
              <td>
                <span className={`badge ${
                  rez.durum === 'Onaylandı' ? 'bg-warning text-dark' :
                  rez.durum === 'Geldi' ? 'bg-success' :
                  rez.durum === 'İptal' ? 'bg-danger' : 'bg-secondary'
                }`}>
                  {rez.durum}
                </span>
              </td>
              <td className="text-end pe-4">
                <div className="btn-group btn-group-sm">
                  <button
                    onClick={() => reservationService.handleRezervasyonDurumGuncelle(rez, 'Onaylandı')}
                    className="btn btn-outline-warning text-dark"
                    title="Onayla (Masa Rezerve Olur)"
                  >
                    <i className="bi bi-calendar-check"></i> Onayla
                  </button>
                  <button
                    onClick={() => reservationService.handleRezervasyonDurumGuncelle(rez, 'Geldi')}
                    className="btn btn-outline-success"
                    title="Müşteri Geldi"
                  >
                    <i className="bi bi-person-check"></i> Geldi
                  </button>
                  <button
                    onClick={() => reservationService.handleRezervasyonDurumGuncelle(rez, 'İptal')}
                    className="btn btn-outline-secondary"
                    title="İptal Et"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => reservationService.handleRezervasyonSil(rez)}
                    className="btn btn-outline-danger"
                    title="Sil"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}