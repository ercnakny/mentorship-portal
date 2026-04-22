import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { signInWithGoogle } from '../firebase/client';

const LoginPage = ({ onLogin, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      
      // Login başarılı, kullanıcı bilgilerini döndür
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="bg-dark-200 rounded-3xl p-8 md:p-12 border border-dark-100 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="text-3xl">🎯</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Akınay Mentörlük</h1>
          <p className="text-gray-400">Mentörlük sürecinizi yönetin</p>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex flex-col items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-primary-500/30 border-t-primary-500 mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-400 text-sm">Giriş yapılıyor...</p>
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
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
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail className="w-6 h-6" />
            Google ile Giriş Yap
          </motion.button>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          Sadece yetkili kullanıcılar giriş yapabilir
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
