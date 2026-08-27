import { useState } from 'react';
import { usePos } from '../context/PosContext';
import tableService from '../services/tableService'; 
import TableList from '../components/TableList';

export default function MasalarSayfasi() {
const { masalar, alanlar, rezervasyonlar = [], masalarYukleniyor } = usePos();

  const [seciliAlanId, setSeciliAlanId] = useState(null);
  

  const aktifAlan = alanlar.find((a) => a.id === seciliAlanId) || alanlar[0] || null;


  const filtrelenmisMasalar = masalar.filter((m) => {
    if (!aktifAlan) return true;
    return m.alanId === aktifAlan.id || m.alan === aktifAlan.ad;
  });

  return (
    <div className="w-100">
     
      <div className="p-4">
        <TableList
          alanlar={alanlar}
          seciliAlan={aktifAlan}
          setSeciliAlan={(alan) => setSeciliAlanId(alan?.id || null)}
          masalar={masalar}
          rezervasyonlar={rezervasyonlar}
          filtrelenmisMasalar={filtrelenmisMasalar}
          handleAlanEkle={tableService.handleAlanEkle}
          handleAlanGuncelle={tableService.handleAlanGuncelle}
          handleAlanSil={tableService.handleAlanSil}
          handleMasaEkle={tableService.handleMasaEkle}
          handleMasaSil={tableService.handleMasaSil}
          handleMasaGuncelle={tableService.handleMasaGuncelle}
          yukleniyor={masalarYukleniyor}
        />
      </div>
    </div>
  );
}