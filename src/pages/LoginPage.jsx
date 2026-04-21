import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    // Gerçek uygulamada Firebase Auth burada çalışacak
    // Demo için direkt giriş yapıyoruz
    onLogin({
      name: 'Ercan Akınay',
      email: 'akinay516@gmail.com',
      role: 'admin',
      startDate: new Date().toISOString(),
      completedSections: [],
      completedSteps: {},
      requestedSections: []
    });
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

        <motion.button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mail className="w-6 h-6" />
          Google ile Giriş Yap
        </motion.button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Sadece yetkili kullanıcılar giriş yapabilir
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;