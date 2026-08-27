import { useState } from 'react';
import { usePos } from '../context/PosContext';
import { useFirestoreCollection } from '../hooks/useFirestore';
import RezervasyonListesi from '../components/RezervasyonListesi';
import RezervasyonModali from '../components/RezervasyonModali';

export default function RezervasyonSayfasi() {
  const { masalar } = usePos();
  const { data: rezervasyonlar, loading } = useFirestoreCollection('rezervasyonlar');
  const [modalAcik, setModalAcik] = useState(false);

  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">


      <div className="flex-grow-1 d-flex flex-column h-100 overflow-auto">
       

<div className="p-4">
  <div className="d-flex align-items-center justify-content-between mb-4">
    <p className="text-muted m-0">Müşteri rezervasyonlarını takip edin ve yeni kayıtlar oluşturun.</p>
    <button
      onClick={() => setModalAcik(true)}
      className="btn btn-success fw-bold rounded-3 px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
    >
      <i className="bi bi-calendar-plus-fill"></i>
      <span>Yeni Rezervasyon Ekle</span>
    </button>
  </div>

  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
    <div className="card-body p-0">
      <RezervasyonListesi rezervasyonlar={rezervasyonlar} loading={loading} />
    </div>
  </div>
</div>
      </div>

      {modalAcik && (
        <RezervasyonModali masalar={masalar} kapat={() => setModalAcik(false)} />
      )}
    </div>
  );
}