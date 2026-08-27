import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function AnaSayfa() {
  const { rol } = useAuth();
  const navigate = useNavigate();

  
  const bugun = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-100">
     
      

      <div className="p-4">
       
        <div className="card border-0 shadow-sm rounded-4 p-4 text-white bg-success position-relative overflow-hidden mb-4">
          <div className="position-relative z-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-white text-success fw-bold text-uppercase px-3 py-1">
                {rol === 'admin' ? 'Yönetici' : rol === 'mutfak' ? 'Mutfak Ekibi' : 'Garson'}
              </span>
              <small className="opacity-75">{bugun}</small>
            </div>
            <h3 className="fw-bold mb-2">Restoran POS Sistemine Hoş Geldiniz!</h3>
            <p className="mb-0 opacity-90 small" style={{ maxWidth: '650px' }}>
              {rol === 'admin' && 'Tüm restoran operasyonunu, masaları, personelleri ve ciro istatistiklerini buradan yönetebilirsiniz.'}
              {rol === 'garson' && 'Masa yönetiminden canlı sipariş alabilir, adisyonları kapatabilir ve rezervasyonları takip edebilirsiniz.'}
              {rol === 'mutfak' && 'Garsonların girdiği anlık siparişleri Mutfak Ekranı üzerinden hazırlayıp teslim edebilirsiniz.'}
            </p>
          </div>
          <i className="bi bi-shop position-absolute end-0 bottom-0 display-1 text-white opacity-25 me-3 mb-n2"></i>
        </div>

        
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3">
            <i className="bi bi-grid-fill text-success me-2"></i>Sistem Modülleri ve Yetkiler
          </h5>

          <div className="row g-3">
           
            {(rol === 'admin' || rol === 'garson') && (
              <div className="col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-success-subtle text-success p-3 rounded-3 fs-4">
                      <i className="bi bi-grid-1x2-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Masa Yönetimi</h6>
                      <small className="text-muted">Adisyon & Sipariş</small>
                    </div>
                  </div>
                  <p className="text-muted small flex-grow-1">
                    Salon, bahçe ve teras masalarını görün. Sipariş oluşturun, parça ödeme alın ve adisyon kapatın.
                  </p>
                  <button
                    onClick={() => navigate('/masalar')}
                    className="btn btn-outline-success btn-sm rounded-3 fw-bold w-100 mt-2"
                  >
                    Masalara Git <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

           
            {(rol === 'admin' || rol === 'mutfak') && (
              <div className="col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-danger-subtle text-danger p-3 rounded-3 fs-4">
                      <i className="bi bi-fire"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Mutfak Ekranı (KDS)</h6>
                      <small className="text-muted">Canlı Sipariş Akışı</small>
                    </div>
                  </div>
                  <p className="text-muted small flex-grow-1">
                    Garsonların girdiği ürünler anında mutfağa düşer. Hazır olan tabakları işaretleyin.
                  </p>
                  <button
                    onClick={() => navigate('/mutfak')}
                    className="btn btn-outline-danger btn-sm rounded-3 fw-bold w-100 mt-2"
                  >
                    Mutfağa Git <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {(rol === 'admin' || rol === 'garson') && (
              <div className="col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary-subtle text-primary p-3 rounded-3 fs-4">
                      <i className="bi bi-calendar-check-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Rezervasyonlar</h6>
                      <small className="text-muted">Masa Planlama</small>
                    </div>
                  </div>
                  <p className="text-muted small flex-grow-1">
                    Müşteri rezervasyonlarını kaydedin, saat bazlı masa durumlarını önceden organize edin.
                  </p>
                  <button
                    onClick={() => navigate('/rezervasyon')}
                    className="btn btn-outline-primary btn-sm rounded-3 fw-bold w-100 mt-2"
                  >
                    Rezervasyonlar <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {rol === 'admin' && (
              <div className="col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-warning-subtle text-warning-emphasis p-3 rounded-3 fs-4">
                      <i className="bi bi-cup-hot-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Menü & Ürünler</h6>
                      <small className="text-muted">Katalog Yönetimi</small>
                    </div>
                  </div>
                  <p className="text-muted small flex-grow-1">
                    Kategorileri ve ürünleri düzenleyin, fiyat güncelleyin ve stok durumlarını kontrol edin.
                  </p>
                  <button
                    onClick={() => navigate('/menu')}
                    className="btn btn-outline-warning text-dark btn-sm rounded-3 fw-bold w-100 mt-2"
                  >
                    Menüyü Düzenle <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

           
            {rol === 'admin' && (
              <div className="col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-info-subtle text-info-emphasis p-3 rounded-3 fs-4">
                      <i className="bi bi-bar-chart-line-fill"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">Raporlar & Ciro</h6>
                      <small className="text-muted">İşletme Analizi</small>
                    </div>
                  </div>
                  <p className="text-muted small flex-grow-1">
                    Günlük, haftalık cirolar, en çok satan yemekler ve ödeme dağılımlarını grafiklerle inceleyin.
                  </p>
                  <button
                    onClick={() => navigate('/istatistik')}
                    className="btn btn-outline-info text-dark btn-sm rounded-3 fw-bold w-100 mt-2"
                  >
                    Raporlara Git <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

       
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 className="fw-bold text-dark mb-4">
            <i className="bi bi-journal-check text-success me-2"></i>Sistem İş Akışı ve Kullanım Kılavuzu
          </h5>

          <div className="row g-4 text-center">
            
            <div className="col-md-4">
              <div className="p-3 rounded-4 bg-light h-100 border">
                <div className="badge bg-success rounded-pill px-3 py-2 mb-3">ADIM 1</div>
                <div className="fs-1 text-success mb-2">
                  <i className="bi bi-tablet"></i>
                </div>
                <h6 className="fw-bold text-dark">Sipariş Alma</h6>
                <p className="text-muted small mb-0">
                  Garson masayı seçer, ürünleri ekler ve <strong>4 haneli PIN</strong> kodunu girerek siparişi mutfağa gönderir.
                </p>
              </div>
            </div>

           
            <div className="col-md-4">
              <div className="p-3 rounded-4 bg-light h-100 border">
                <div className="badge bg-danger rounded-pill px-3 py-2 mb-3">ADIM 2</div>
                <div className="fs-1 text-danger mb-2">
                  <i className="bi bi-fire"></i>
                </div>
                <h6 className="fw-bold text-dark">Mutfak Hazırlığı</h6>
                <p className="text-muted small mb-0">
                  Sipariş anında Mutfak Ekranı'na düşer. Yemek hazır olunca aşçı <strong>"Hazırlandı"</strong> butonuna basar.
                </p>
              </div>
            </div>

           
            <div className="col-md-4">
              <div className="p-3 rounded-4 bg-light h-100 border">
                <div className="badge bg-primary rounded-pill px-3 py-2 mb-3">ADIM 3</div>
                <div className="fs-1 text-primary mb-2">
                  <i className="bi bi-credit-card-2-front"></i>
                </div>
                <h6 className="fw-bold text-dark">Ödeme & Kapatma</h6>
                <p className="text-muted small mb-0">
                  Müşteri hesabı Nakit veya Kredi Kartı ile öder. Adisyon kapanır, masa boşalır ve ciro raporuna işlenir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}