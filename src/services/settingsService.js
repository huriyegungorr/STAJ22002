import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';


export const getIsletmeBilgileri = async () => {
  try {
    const docRef = doc(db, 'ayarlar', 'isletme');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Ayarlar çekilirken hata oluştu:', error);
    return null;
  }
};


export const saveIsletmeBilgileri = async (ayarlar) => {
  try {
    const docRef = doc(db, 'ayarlar', 'isletme');
    await setDoc(docRef, ayarlar, { merge: true });
    return true;
  } catch (error) {
    console.error('Ayarlar kaydedilirken hata oluştu:', error);
    return false;
  }
};

const settingsService = {
  getIsletmeBilgileri,
  saveIsletmeBilgileri,
};

export default settingsService;