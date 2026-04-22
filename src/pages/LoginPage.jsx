import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../firebase/client';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      // Firebase onAuthStateChanged App.jsx'te dinliyor, burada sadece popup açılıyor
    } catch (err) {
      let errorMessage = 'Giriş yapılamadı. Lütfen tekrar deneyin.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Giriş penceresi kapatıldı.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Ağ bağlantısı hatası.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'Bu alan adı yetkilendirilmemiş. Firebase Console\'a ekleyin.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content - Fully centered, no box */}
      <motion.div 
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo - Centered at top */}
        <motion.div 
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <span className="text-4xl">🎯</span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Akınay Mentörlük</h1>
          <p className="text-gray-400">Mentörlük sürecinizi yönetin</p>
        </motion.div>

        {/* Login Section - NO BOX, just clean button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-gray-400 text-sm mt-4">Giriş yapılıyor...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div 
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Google Button - No container, just clean button */}
          {!loading && (
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Giriş Yap
            </button>
          )}

          {/* Info Text - Spaced below button */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Sadece yetkili kullanıcılar giriş yapabilir
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-600 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © 2026 Akınay Mentörlük
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
