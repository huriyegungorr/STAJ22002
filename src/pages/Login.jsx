import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError('E-posta veya şifre hatalı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 vw-100 p-3"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white w-100"
        style={{ maxWidth: '420px' }}
      >
        
        <div className="text-center mb-4">
          <div
            className="bg-success text-white rounded-4 d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
            style={{ width: '60px', height: '60px' }}
          >
            <i className="bi bi-shop fs-2"></i>
          </div>
          <h3 className="fw-bold text-dark m-0">Restoran POS</h3>
          <p className="text-muted small mb-0 mt-1">Giriş Yaparak Devam Edin</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 border-0 mb-3 text-center fw-semibold">
            <i className="bi bi-exclamation-circle me-1"></i>
            {error}
          </div>
        )}

       
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-bold text-secondary mb-1">
              E-Posta Adresi
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                required
                placeholder="ornek@restoran.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control bg-light border-start-0 rounded-end-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="form-label small fw-bold text-secondary mb-1">
              Şifre
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control bg-light border-start-0 rounded-end-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success btn-lg fw-bold rounded-3 py-2.5 mt-2 shadow-sm"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : (
              <i className="bi bi-box-arrow-in-right me-2"></i>
            )}
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-muted" style={{ fontSize: '11px' }}>
          Restoran POS Terminali
        </div>
      </div>
    </div>
  );
}