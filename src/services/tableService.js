import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const handleAlanEkle = async (ad) => {
  try {
    await addDoc(collection(db, 'alanlar'), { ad });
  } catch (e) {
    console.error('Alan ekleme hatası:', e);
  }
};

export const handleAlanGuncelle = async (id, yeniAd) => {
  try {
    await updateDoc(doc(db, 'alanlar', id), { ad: yeniAd });
  } catch (e) {
    console.error('Alan güncelleme hatası:', e);
  }
};

export const handleAlanSil = async (id, ad) => {
  if (window.confirm(`"${ad}" alanını silmek istediğinize emin misiniz?`)) {
    try {
      await deleteDoc(doc(db, 'alanlar', id));
    } catch (e) {
      console.error('Alan silme hatası:', e);
    }
  }
};

export const handleMasaEkle = async (yeniMasa) => {
  try {
    await addDoc(collection(db, 'masalar'), {
      ad: yeniMasa.ad || 'Yeni Masa',
      tip: yeniMasa.tip || 'Standart',
      sandalye_sayisi: Number(yeniMasa.sandalye_sayisi || yeniMasa.sandalyeSayisi) || 4,
      alanId: yeniMasa.alanId || '',
      alan: yeniMasa.alan || 'Salon',
      durum: 'bos',
      adisyon: [],
      toplamTutar: 0,
      olusturulmaTarihi: new Date()
    });
    return true;
  } catch (error) {
    console.error('Masa eklenirken hata:', error);
    alert('Masa eklenirken hata oluştu: ' + error.message);
    return false;
  }
};

export const handleMasaSil = async (id) => {
  if (window.confirm('Bu masayı silmek istediğinize emin misiniz?')) {
    try {
      await deleteDoc(doc(db, 'masalar', id));
    } catch (e) {
      console.error('Masa silme hatası:', e);
    }
  }
};

export const handleMasaGuncelle = async (masaId, yeniVeriler) => {
  try {
    const masaRef = doc(db, 'masalar', masaId);
    await updateDoc(masaRef, yeniVeriler);


    if (yeniVeriler.rezerveDurum === 'geldi') {
   
      const q = query(
        collection(db, 'rezervasyonlar'),
        where('masaId', '==', masaId)
      );
      const snap = await getDocs(q);

      const updates = snap.docs.map((d) => {
        const data = d.data();
     
        if (data.durum === 'Bekliyor' || data.durum === 'Onaylandı') {
          return updateDoc(d.ref, { durum: 'Geldi' });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(updates);
    }

    return true;
  } catch (error) {
    console.error('Masa güncellenirken hata oluştu:', error);
    return false;
  }
};

const tableService = {
  handleAlanEkle,
  handleAlanGuncelle,
  handleAlanSil,
  handleMasaEkle,
  handleMasaSil,
  handleMasaGuncelle,
};

export default tableService;