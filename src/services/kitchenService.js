import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const handleMutfakDurumGuncelle = async (masaId, adisyon, urunIndex, yeniDurum) => {
  try {
    const yeniAdisyon = [...adisyon];
    yeniAdisyon[urunIndex].mutfakDurumu = yeniDurum; 

    await updateDoc(doc(db, 'masalar', masaId), {
      adisyon: yeniAdisyon,
    });
    return true;
  } catch (error) {
    console.error('Mutfak durum güncelleme hatası:', error);
    return false;
  }
};

export const handleSiparisIptalEt = async (masaId, adisyon, urunIndex, iptalNotu) => {
  try {
    const yeniAdisyon = [...adisyon];
    const hedefUrun = { ...yeniAdisyon[urunIndex] };

    if (hedefUrun.adet > 1) {
 
      yeniAdisyon[urunIndex] = {
        ...hedefUrun,
        adet: hedefUrun.adet - 1,
      };

      yeniAdisyon.push({
        ...hedefUrun,
        adet: 1,
        mutfakDurumu: 'iptal',
        iptalNotu: iptalNotu || 'Mutfak tarafından 1 adet iptal edildi',
      });
    } else {
      
      yeniAdisyon[urunIndex] = {
        ...hedefUrun,
        mutfakDurumu: 'iptal',
        iptalNotu: iptalNotu || 'Mutfak tarafından iptal edildi',
      };
    }

    await updateDoc(doc(db, 'masalar', masaId), {
      adisyon: yeniAdisyon,
    });

    return true;
  } catch (error) {
    console.error('Sipariş iptal hatası:', error);
    return false;
  }
};

const kitchenService = {
  handleMutfakDurumGuncelle,
  handleSiparisIptalEt,
};

export default kitchenService;