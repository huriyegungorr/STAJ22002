import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const getIstatistikler = async () => {
  const varsayilanVeri = {
    bugunkuCiro: 0,
    toplamCiro: 0,
    bugunkuSiparisSayisi: 0,
    toplamSiparisSayisi: 0,
    ortalamaAdisyon: 0,
    doluMasaSayisi: 0,
    toplamMasaSayisi: 0,
    dolulukOrani: 0,
    populerUrunler: [],
  };

  try {
   
    let satislar = [];
    try {
      const satislarSnap = await getDocs(collection(db, 'satislar'));
      satislar = satislarSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('satislar koleksiyonu okunamadı.');
    }

    let masalar = [];
    try {
      const masalarSnap = await getDocs(collection(db, 'masalar'));
      masalar = masalarSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('masalar koleksiyonu okunamadı.');
    }

   
    const bugunBaslangic = new Date();
    bugunBaslangic.setHours(0, 0, 0, 0);

    let bugunkuCiro = 0;
    let toplamCiro = 0;
    let bugunkuSiparisSayisi = 0;
    const urunSatisMiktarlari = {};

    
    const urunleriHesabaKat = (urunListesi) => {
      if (!Array.isArray(urunListesi)) return;

      urunListesi.forEach((item) => {
        const urunAd = item.urun_adi || item.ad || item.name || item.title;
        const adet = Number(item.adet || item.count || 1);

        if (urunAd) {
          urunSatisMiktarlari[urunAd] = (urunSatisMiktarlari[urunAd] || 0) + adet;
        }
      });
    };

    satislar.forEach((satis) => {
      const tutar = Number(satis.toplamTutar || satis.toplam_tutar || 0);
      toplamCiro += tutar;

      
      let satisTarihi = new Date();
      if (satis.tarih) {
        satisTarihi = satis.tarih.seconds ? new Date(satis.tarih.seconds * 1000) : new Date(satis.tarih);
      }

      if (satisTarihi >= bugunBaslangic) {
        bugunkuCiro += tutar;
        bugunkuSiparisSayisi++;
      }

      
      urunleriHesabaKat(satis.adisyon || satis.siparisler || satis.urunler);
    });


    masalar.forEach((masa) => {
      if (masa.durum === 'dolu' && Array.isArray(masa.adisyon)) {
        urunleriHesabaKat(masa.adisyon);
      }
    });

    
    const populerUrunler = Object.entries(urunSatisMiktarlari)
      .map(([ad, adet]) => ({ ad, adet }))
      .sort((a, b) => b.adet - a.adet)
      .slice(0, 5);

    
    const doluMasaSayisi = masalar.filter((m) => m.durum === 'dolu').length;
    const dolulukOrani = masalar.length > 0 ? Math.round((doluMasaSayisi / masalar.length) * 100) : 0;
    const toplamSiparis = satislar.length;

    return {
      bugunkuCiro,
      toplamCiro,
      bugunkuSiparisSayisi,
      toplamSiparisSayisi: toplamSiparis,
      ortalamaAdisyon: toplamSiparis > 0 ? Math.round(toplamCiro / toplamSiparis) : 0,
      doluMasaSayisi,
      toplamMasaSayisi: masalar.length,
      dolulukOrani,
      populerUrunler,
    };
  } catch (error) {
    console.error('İstatistik hesaplama hatası:', error);
    return varsayilanVeri;
  }
};

const statsService = {
  getIstatistikler,
};

export default statsService;