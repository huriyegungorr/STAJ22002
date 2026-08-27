import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const handleKategoriEkle = async (ad) => {
  try {
    await addDoc(collection(db, 'kategoriler'), { ad });
  } catch (e) {
    console.error('Kategori ekleme hatası:', e);
  }
};

export const handleKategoriGuncelle = async (id, yeniAd) => {
  try {
    await updateDoc(doc(db, 'kategoriler', id), { ad: yeniAd });
  } catch (e) {
    console.error('Kategori güncelleme hatası:', e);
  }
};

export const handleKategoriSil = async (id, ad) => {
  if (window.confirm(`"${ad}" kategorisini silmek istediğinize emin misiniz?`)) {
    try {
      await deleteDoc(doc(db, 'kategoriler', id));
    } catch (e) {
      console.error('Kategori silme hatası:', e);
    }
  }
};

export const handleUrunEkle = async (yeniUrun) => {
  try {
    await addDoc(collection(db, 'urunler'), {
      ...yeniUrun,
      aktif_mi: true,
      olusturulma_tarihi: new Date(),
    });
  } catch (e) {
    console.error('Ürün ekleme hatası:', e);
  }
};

export const handleUrunGuncelle = async (id, guncelVeri) => {
  try {
    await updateDoc(doc(db, 'urunler', id), guncelVeri);
  } catch (e) {
    console.error('Ürün güncelleme hatası:', e);
  }
};

export const handleUrunSil = async (id) => {
  if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
    try {
      await deleteDoc(doc(db, 'urunler', id));
    } catch (e) {
      console.error('Ürün silme hatası:', e);
    }
  }
};

export const handleDurumDegistir = async (id, mevcutDurum) => {
  try {
    await updateDoc(doc(db, 'urunler', id), { aktif_mi: !mevcutDurum });
  } catch (e) {
    console.error('Durum değiştirme hatası:', e);
  }
};


const menuService = {
  handleKategoriEkle,
  handleKategoriGuncelle,
  handleKategoriSil,
  handleUrunEkle,
  handleUrunGuncelle,
  handleUrunSil,
  handleDurumDegistir,
};

export default menuService;