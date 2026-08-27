import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePos } from '../context/PosContext';

export default function MasaQrKodlari() {
  const { masalar, masalarYukleniyor } = usePos();
  const printRef = useRef();

 
  const handleYazdir = () => {
    window.print();
  };

  if (masalarYukleniyor) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div>
     
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h6 className="fw-bold m-0 text-dark">Masa QR Kod Yönetimi</h6>
          <small className="text-muted">
            Müşterilerin menüyü görmesi için masalara yapıştırılacak QR kodlar.
          </small>
        </div>
        <button
          onClick={handleYazdir}
          className="btn btn-dark btn-sm rounded-3 fw-bold px-3 py-2 d-flex align-items-center gap-2"
        >
          <i className="bi bi-printer"></i>
          <span>Tüm QR Kodları Yazdır</span>
        </button>
      </div>

  
      <div ref={printRef} className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 print-area">
        {masalar.map((masa) => {
          
          const qrUrl = `${window.location.origin}/qr-menu/${masa.id}`;

          return (
            <div key={masa.id} className="col">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100 d-flex flex-column align-items-center justify-content-between">
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill small fw-bold mb-2">
                    {masa.alan || 'Salon'}
                  </span>
                  <h5 className="fw-bold text-dark m-0">{masa.ad || masa.name}</h5>
                </div>

                <div className="my-3 p-3 bg-light rounded-4 border d-inline-block">
                  <QRCodeSVG
                    value={qrUrl}
                    size={150}
                    bgColor={"#ffffff"}
                    fgColor={"#111111"}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>

                <small className="text-muted d-block mb-2" style={{ fontSize: 11 }}>
                  Kamera ile taratıp menüyü inceleyebilirsiniz.
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}