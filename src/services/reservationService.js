import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const handleRezervasyonEkle = async (yeniRezervasyon) => {
  try {
  
    await addDoc(collection(db, 'rezervasyonlar'), {
      musteriAdi: yeniRezervasyon.musteriAdi,
      telefon: yeniRezervasyon.telefon,
      kisiSayisi: Number(yeniRezervasyon.kisiSayisi) || 1,
      tarih: yeniRezervasyon.tarih, 
      saat: yeniRezervasyon.saat,   
      masaId: yeniRezervasyon.masaId || '',
      masaAd: yeniRezervasyon.masaAd || 'Masa Seçilmedi',
      not: yeniRezervasyon.not || '',
      durum: 'Bekliyor', 
      olusturulmaTarihi: new Date(),
    });

  
    if (yeniRezervasyon.masaId) {
      await updateDoc(doc(db, 'masalar', yeniRezervasyon.masaId), {
        durum: 'rezerve',
      });
    }

    return true;
  } catch (error) {
    console.error('Rezervasyon ekleme hatası:', error);
    return false;
  }
};

export const handleRezervasyonDurumGuncelle = async (rez, yeniDurum) => {
  try {
    if (rez.masaId && yeniDurum === 'Onaylandı') {
      const masaDoc = await getDoc(doc(db, 'masalar', rez.masaId));
      if (masaDoc.exists() && masaDoc.data().durum === 'dolu') {
        alert('Bu masa şu anda doludur, rezervasyon onaylanamaz!');
        return false;
      }
      await updateDoc(doc(db, 'masalar', rez.masaId), { durum: 'rezerve' });
    } else if (rez.masaId && yeniDurum === 'Geldi') {
      await updateDoc(doc(db, 'masalar', rez.masaId), { durum: 'dolu' });
    } else if (rez.masaId && yeniDurum === 'İptal') {
      await updateDoc(doc(db, 'masalar', rez.masaId), { durum: 'bos' });
    }

    await updateDoc(doc(db, 'rezervasyonlar', rez.id), {
      durum: yeniDurum,
    });

    return true;
  } catch (error) {
    console.error('Durum güncelleme hatası:', error);
    return false;
  }
};

export const handleRezervasyonSil = async (rez) => {
  if (!window.confirm('Bu rezervasyonu silmek istediğinize emin misiniz?')) return false;
  try {
    await deleteDoc(doc(db, 'rezervasyonlar', rez.id));


    if (rez.masaId) {
      await updateDoc(doc(db, 'masalar', rez.masaId), {
        durum: 'bos',
      });
    }
    return true;
  } catch (error) {
    console.error('Rezervasyon silme hatası:', error);
    return false;
  }
};

const reservationService = {
  handleRezervasyonEkle,
  handleRezervasyonDurumGuncelle,
  handleRezervasyonSil,
};

export default reservationService;