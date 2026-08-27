import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import KullaniciEkleModal from './KullaniciEkleModal';

export default function PersonelYonetimi() {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const kullanicilariGetir = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'kullanicilar'));
      setKullanicilar(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Kullanıcı çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    kullanicilariGetir();
  }, []);

  
  const durumDegistir = async (id, mevcutDurum) => {
    try {
      await updateDoc(doc(db, 'kullanicilar', id), { aktif_mi: !mevcutDurum });
      kullanicilariGetir();
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
    }
  };

  
  const personelSil = async (id, ad) => {
    const onay = window.confirm(`"${ad}" isimli personeli sistemden kalıcı olarak silmek istediğinize emin misiniz?`);
    
    if (onay) {
      try {
        await deleteDoc(doc(db, 'kullanicilar', id));
        kullanicilariGetir(); 
      } catch (err) {
        console.error('Personel silme hatası:', err);
        alert('Personel silinirken bir hata oluştu.');
      }
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h6 className="fw-bold m-0 text-dark">Kayıtlı Garson ve Personeller</h6>
          <small className="text-muted">Personellerin yetkilerini, PIN erişimlerini ve hesap durumlarını yönetin.</small>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-success fw-bold rounded-3 px-3 py-2 shadow-sm d-flex align-items-center gap-2"
        >
          <i className="bi bi-person-plus-fill"></i> Yeni Personel & PIN Ekle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">Ad Soyad</th>
                <th className="py-3">Rol</th>
                <th className="py-3">PIN Güvenliği</th>
                <th className="py-3">Durum</th>
                <th className="py-3 text-end px-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {kullanicilar.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Henüz kayıtlı personel yok.
                  </td>
                </tr>
              ) : (
                kullanicilar.map((k) => (
                  <tr key={k.id}>
                    <td className="py-3 px-4 fw-bold text-dark">{k.ad}</td>
                    <td className="py-3">
                      <span
                        className={`badge px-3 py-2 rounded-pill ${
                          k.rol === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'
                        }`}
                      >
                        {k.rol?.toUpperCase() || 'GARSON'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-light text-muted border">
                        <i className="bi bi-shield-lock me-1"></i>SHA-256 Şifreli
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`badge ${k.aktif_mi !== false ? 'bg-success' : 'bg-secondary'}`}>
                        {k.aktif_mi !== false ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-3 text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                      
                        <button
                          onClick={() => durumDegistir(k.id, k.aktif_mi !== false)}
                          className={`btn btn-sm ${
                            k.aktif_mi !== false ? 'btn-outline-warning' : 'btn-outline-success'
                          } rounded-3 fw-bold`}
                          title={k.aktif_mi !== false ? 'Hesabı dondur' : 'Hesabı aktifleştir'}
                        >
                          {k.aktif_mi !== false ? 'Pasife Al' : 'Aktif Et'}
                        </button>

                       
                        <button
                          onClick={() => personelSil(k.id, k.ad)}
                          className="btn btn-sm btn-outline-danger rounded-3 fw-bold"
                          title="Personeli kalıcı olarak sil"
                        >
                          <i className="bi bi-trash-fill"></i> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <KullaniciEkleModal show={showModal} onClose={() => setShowModal(false)} onSuccess={kullanicilariGetir} />
    </div>
  );
}