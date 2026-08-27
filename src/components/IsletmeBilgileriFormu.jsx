import { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';

export default function IsletmeBilgileriFormu({ onMesajGoster }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    isletmeAdi: '',
    telefon: '',
    eposta: '',
    adres: '',
    vergiDairesi: '',
    vergiNo: '',
    kdvOrani: 10,
    paraBirimi: 'TL',
    logoUrl: '',
  });

  useEffect(() => {
    async function ayarlariYukle() {
      setLoading(true);
      const veri = await settingsService.getIsletmeBilgileri();
      if (veri) {
        setForm((prev) => ({ ...prev, ...veri }));
      }
      setLoading(false);
    }
    ayarlariYukle();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoSec = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const basarili = await settingsService.saveIsletmeBilgileri(form);
    setSaving(false);

    if (basarili) {
      onMesajGoster('İşletme bilgileri başarıyla güncellendi!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="row g-4">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Genel İşletme Bilgileri</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">İşletme Adı</label>
              <input
                type="text"
                name="isletmeAdi"
                required
                className="form-control rounded-3"
                value={form.isletmeAdi}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Telefon</label>
              <input
                type="text"
                name="telefon"
                className="form-control rounded-3"
                value={form.telefon}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">E-posta</label>
              <input
                type="email"
                name="eposta"
                className="form-control rounded-3"
                value={form.eposta}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Para Birimi</label>
              <select
                name="paraBirimi"
                className="form-select rounded-3"
                value={form.paraBirimi}
                onChange={handleChange}
              >
                <option value="TL">Türk Lirası (TL / ₺)</option>
                <option value="USD">Dolar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary">Adres</label>
              <textarea
                name="adres"
                rows="3"
                className="form-control rounded-3"
                value={form.adres}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Vergi & Fiş Bilgileri</h6>
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label small fw-bold text-secondary">Vergi Dairesi</label>
              <input
                type="text"
                name="vergiDairesi"
                className="form-control rounded-3"
                value={form.vergiDairesi}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-secondary">Vergi No</label>
              <input
                type="text"
                name="vergiNo"
                className="form-control rounded-3"
                value={form.vergiNo}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold text-secondary">Varsayılan KDV (%)</label>
              <input
                type="number"
                name="kdvOrani"
                className="form-control rounded-3"
                value={form.kdvOrani}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
          <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 text-start">İşletme Logosu</h6>
          <div className="my-3">
            <img
              src={form.logoUrl || 'https://placehold.co/150x150/e9ecef/198754?text=Logo'}
              alt="Logo"
              className="rounded-4 border p-2 shadow-sm"
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />
          </div>
          <input type="file" accept="image/*" id="logoInput" onChange={handleLogoSec} className="d-none" />
          <label htmlFor="logoInput" className="btn btn-outline-success btn-sm rounded-3 fw-bold w-100">
            Logo Yükle
          </label>
        </div>

        <div className="mt-4">
          <button type="submit" disabled={saving} className="btn btn-success fw-bold w-100 py-3 rounded-4 shadow-sm">
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </form>
  );
}