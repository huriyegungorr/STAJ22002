import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { hashPin } from '../utils/hashUtils';

export default function PinModal({ show, onClose, onPinVerified }) {
  const [pin, setPin] = useState('');
  const [hata, setHata] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleTusBas = (rakam) => {
    if (pin.length < 4) {
      const yeniPin = pin + rakam;
      setPin(yeniPin);
      if (yeniPin.length === 4) {
        pinDogrula(yeniPin);
      }
    }
  };

  const handleSil = () => {
    setPin(pin.slice(0, -1));
    setHata('');
  };

  const pinDogrula = async (girilenPin) => {
  try {
    setLoading(true);
    setHata('');

    const hashedInputPin = await hashPin(girilenPin);

   
    const q = query(
      collection(db, 'kullanicilar'),
      where('pin', '==', hashedInputPin),
      where('aktif_mi', '==', true)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const garsonData = querySnapshot.docs[0].data();
      onPinVerified(garsonData); 
      setPin('');
      onClose();
    } else {
      setHata('Hatalı PIN!');
      setPin('');
    }
  } catch (err) {
    console.error('PIN doğrulama hatası:', err);
    setHata('Doğrulama yapılamadı.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="modal show d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content rounded-4 border-0 p-3 text-center">
          <h6 className="fw-bold mb-2">Garson PIN Doğrulama</h6>
          
         
          <div className="d-flex justify-content-center gap-2 my-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`rounded-circle border border-2 ${
                  pin.length > idx ? 'bg-success border-success' : 'bg-light'
                }`}
                style={{ width: 16, height: 16 }}
              ></div>
            ))}
          </div>

          {hata && <small className="text-danger d-block mb-2 fw-bold">{hata}</small>}

          
          <div className="row g-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div className="col-4" key={num}>
                <button
                  onClick={() => handleTusBas(num.toString())}
                  className="btn btn-light w-100 py-3 fw-bold fs-5 rounded-3 shadow-sm border"
                >
                  {num}
                </button>
              </div>
            ))}
            <div className="col-4">
              <button onClick={onClose} className="btn btn-outline-danger w-100 py-3 fw-bold rounded-3">
                İptal
              </button>
            </div>
            <div className="col-4">
              <button
                onClick={() => handleTusBas('0')}
                className="btn btn-light w-100 py-3 fw-bold fs-5 rounded-3 shadow-sm border"
              >
                0
              </button>
            </div>
            <div className="col-4">
              <button onClick={handleSil} className="btn btn-outline-secondary w-100 py-3 fw-bold rounded-3">
                <i className="bi bi-backspace"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}