import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { hashPin } from '../utils/hashUtils';

export default function KullaniciEkleModal({ show, onClose, onSuccess }) {
  const [ad, setAd] = useState('');
  const [rol, setRol] = useState('garson');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (pin.length !== 4) {
    alert('PIN kodu tam 4 haneli olmalıdır!');
    return;
  }

  try {
    setLoading(true);

    const hashedPin = await hashPin(pin);

    await addDoc(collection(db, 'kullanicilar'), {
      ad,
      rol,
      pin: hashedPin, 
      aktif_mi: true,
      olusturulma_tarihi: new Date(),
    });

    setAd('');
    setPin('');
    onSuccess();
    onClose();
  } catch (err) {
    console.error('Personel ekleme hatası:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal show d-block tab-index-1 bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Yeni Personel & PIN Tanımla</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">Personel Ad Soyad</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Örn: Ahmet Yılmaz"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Rol</label>
              <select className="form-select rounded-3" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="garson">Garson</option>
                <option value="kasiyer">Kasiyer</option>
                
                <option value="admin">Yönetici</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">4 Haneli Giriş PIN'i</label>
              <input
                type="password"
                maxLength="4"
                className="form-control rounded-3 text-center fs-4 fw-bold letter-spacing-2"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 rounded-3 fw-bold py-2" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Personeli Kaydet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}