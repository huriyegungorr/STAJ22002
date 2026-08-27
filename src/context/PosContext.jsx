import { createContext, useContext } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { doc, updateDoc, addDoc, collection, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';

const PosContext = createContext();

export function PosProvider({ children }) {
 
  const { data: masalar, loading: masalarYukleniyor } = useFirestoreCollection('masalar');
  const { data: urunler } = useFirestoreCollection('urunler');
  const { data: kategoriler } = useFirestoreCollection('kategoriler');
  const { data: alanlar } = useFirestoreCollection('alanlar');
  const { data: rezervasyonlar } = useFirestoreCollection('rezervasyonlar');

 


  const masaTasi = async (kaynakMasaId, hedefMasaId) => {
    try {
      const kaynakMasa = masalar.find((m) => m.id === kaynakMasaId);
      if (!kaynakMasa) return false;

      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, 'masalar', hedefMasaId), {
          adisyon: kaynakMasa.adisyon || [],
          toplamTutar: kaynakMasa.toplamTutar || 0, 
          durum: 'dolu',
        });
        transaction.update(doc(db, 'masalar', kaynakMasaId), {
          adisyon: [],
          toplamTutar: 0, 
          durum: 'bos',
        });
      });
      return true;
    } catch (error) {
      console.error('Masa taşıma hatası:', error);
      return false;
    }
  };

  const masaBirlestir = async (kaynakMasaId, hedefMasaId) => {
    try {
      const kaynakMasa = masalar.find((m) => m.id === kaynakMasaId);
      const hedefMasa = masalar.find((m) => m.id === hedefMasaId);

      if (!kaynakMasa || !hedefMasa) return false;

      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, 'masalar', hedefMasaId), {
          adisyon: [...(hedefMasa.adisyon || []), ...(kaynakMasa.adisyon || [])],
          toplamTutar: (hedefMasa.toplamTutar || 0) + (kaynakMasa.toplamTutar || 0),
          durum: 'dolu',
        });
        transaction.update(doc(db, 'masalar', kaynakMasaId), {
          adisyon: [],
          toplamTutar: 0, 
          durum: 'bos',
        });
      });
      return true;
    } catch (error) {
      console.error('Masa birleştirme hatası:', error);
      return false;
    }
  };

  return (
    <PosContext.Provider
      value={{
        masalar,
        masalarYukleniyor,
        urunler,
        rezervasyonlar: rezervasyonlar || [],
        kategoriler,
        alanlar,
        masaTasi,
        masaBirlestir,
      }}
    >
      {children}
    </PosContext.Provider>
  );
}

export const usePos = () => useContext(PosContext);