import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../firebase/client';

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      
      onLogin({
        uid: result.uid,
        name: result.displayName,
        email: result.email,
        photoURL: result.photoURL,
        role: 'user',
        startDate: new Date().toISOString(),
        completedSections: [],
        completedSteps: {},
        requestedSections: []
      });
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Giriş yapılamadı. Lütfen tekrar deneyin.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Giriş penceresi kapatıldı.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Ağ bağlantısı hatası. İnternetinizi kontrol edin.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'Bu alan adı yetkilendirilmemiş.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5" />
      
      <motion.div 
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Area */}
        <motion.div 
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <span className="text-3xl">🎯</span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Akınay Mentörlük</h1>
          <p className="text-gray-400">Mentörlük sürecinizi yönetin</p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          className="bg-dark-200/80 backdrop-blur-sm rounded-2xl p-8 border border-dark-100/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Loading State */}
          {loading && (
            <motion.div 
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full border-4 border-primary-500/20 border-t-primary-500 mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-gray-400 text-sm">Giriş yapılıyor...</p>
            </motion.div>
          )}

          {/* Error State */}
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

          {/* Login Button */}
          {!loading && (
            <motion.button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium py-4 px-6 rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Giriş Yap
            </motion.button>
          )}

          <div className="mt-6 pt-6 border-t border-dark-100/50">
            <p className="text-center text-gray-500 text-xs">
              Sadece yetkili kullanıcılar giriş yapabilir
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-600 text-xs mt-6"
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
