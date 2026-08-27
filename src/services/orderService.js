import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';


export const handleSiparisiKaydet = async (masaId, sepet, toplamTutar) => {
  try {
   
    const guncelAdisyon = sepet.map((item) => ({
      ...item,
      mutfakDurumu: item.mutfakDurumu || 'bekliyor',
    }));

    const masaRef = doc(db, 'masalar', masaId);
    await updateDoc(masaRef, {
      adisyon: guncelAdisyon,
      toplamTutar: Number(toplamTutar),
      durum: 'dolu',
    });

    return true;
  } catch (error) {
    console.error('Sipariş kaydedilirken hata:', error);
    return false;
  }
};

export const handleHesapKapat = async (masaId, odemeDetayi) => {
  try {
    const masaRef = doc(db, 'masalar', masaId);
    const masaSnap = await getDoc(masaRef);
    const masaData = masaSnap.exists() ? masaSnap.data() : {};

    await addDoc(collection(db, 'satislar'), {
      masaId,
      toplamTutar: odemeDetayi.toplamTutar,
      odemeSekli: odemeDetayi.odemeSekli || 'tekil',
      detay: odemeDetayi.detay || [], 
      adisyon: masaData.adisyon || [],
      tarih: new Date(),
    });

  
    await updateDoc(masaRef, {
      durum: 'bos',
      toplamTutar: 0,
      adisyon: [],
    });

    return true;
  } catch (error) {
    console.error('Hesap kapatma hatası:', error);
    return false;
  }
};

const orderService = {
  handleSiparisiKaydet,
  handleHesapKapat,
};

export default orderService;