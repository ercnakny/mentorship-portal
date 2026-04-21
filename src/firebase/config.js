// Firebase configuration
// Not: Bu dosya Firebase Console'dan alınan konfigürasyonu içerir
// Şu an için Service Account üzerinden Admin SDK kullanılıyor

export const firebaseConfig = {
  apiKey: "AIzaSyDemo_API_KEY",
  authDomain: "akinay-ment-x.firebaseapp.com",
  projectId: "akinay-ment-x",
  storageBucket: "akinay-ment-x.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Admin SDK için Service Account - sunucu tarafında çalışır
// Bu dosya client tarafında kullanılmaz, sadece backend/Admin işlemleri için
export const adminConfig = {
  // Service Account JSON bilgileri backend'de saklanır
  // Şu an ~/.config/firebase/akinay-ment-x.json kullanılıyor
};

export default firebaseConfig;