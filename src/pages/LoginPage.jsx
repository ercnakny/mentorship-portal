import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail } from '../firebase/client';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      let errorMessage = 'Giriş yapılamadı.';
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'E-posta veya şifre hatalı.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta ile kayıtlı kullanıcı yok.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla deneme. Daha sonra tekrar deneyin.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div 
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <span className="text-4xl">🎯</span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-3">Akınay Mentörlük</h1>
          <p className="text-gray-400 text-base">Mentörlük sürecinizi yönetin</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleEmailLogin}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Error */}
          {error && (
            <motion.div 
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Email Input */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm">E-posta</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              required
              className="w-full bg-dark-300 border-2 border-dark-100 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors text-base"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm">Şifre</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                required
                className="w-full bg-dark-300 border-2 border-dark-100 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base mt-6"
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </motion.form>

        {/* Info Text */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Sadece yetkili kullanıcılar giriş yapabilir
        </p>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-600 text-sm mt-4"
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
