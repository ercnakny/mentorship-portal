import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail } from '../firebase/client';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('E-posta veya şifre hatalı.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta ile kayıtlı kullanıcı yok.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla deneme. Daha sonra tekrar deneyin.');
      } else {
        setError('Giriş yapılamadı.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Background Effects */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '384px',
          height: '384px',
          backgroundColor: 'rgba(14, 165, 233, 0.05)',
          borderRadius: '9999px',
          filter: 'blur(96px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '384px',
          height: '384px',
          backgroundColor: 'rgba(2, 132, 199, 0.05)',
          borderRadius: '9999px',
          filter: 'blur(96px)'
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '448px' }}>
        {/* Logo */}
        <motion.div 
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'linear-gradient(to bottom right, #0ea5e9, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.2)'
          }}>
            <span style={{ fontSize: '40px' }}>🎯</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '32px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Akınay Mentörlük</h1>
          <p style={{ fontSize: '16px', color: '#9ca3af' }}>Mentörlük sürecinizi yönetin</p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Error Alert */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }} role="alert">
              <AlertCircle style={{ width: '20px', height: '20px', color: '#f87171', flexShrink: 0 }} />
              <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 500, color: '#e5e7eb' }}>
              E-posta
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <Mail style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#151c2c',
                  border: '2px solid #1e293b',
                  borderRadius: '12px',
                  paddingLeft: '56px',
                  paddingRight: '16px',
                  fontSize: '16px',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0ea5e9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 500, color: '#e5e7eb' }}>
              Şifre
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <Lock style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#151c2c',
                  border: '2px solid #1e293b',
                  borderRadius: '12px',
                  paddingLeft: '56px',
                  paddingRight: '56px',
                  fontSize: '16px',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0ea5e9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e293b';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d1d5db'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Eye style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: loading ? '#0ea5e9' : '#0ea5e9',
              color: 'white',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '32px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#0284c7';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#0ea5e9';
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </motion.form>

        {/* Footer */}
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            Sadece yetkili kullanıcılar giriş yapabilir
          </p>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
            © 2026 Akınay Mentörlük
          </p>
        </div>
      </div>

      {/* Spin Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
