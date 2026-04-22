import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzik-WQRwG6yi7rWqhFrJGN2H4lMBH2Z8",
  authDomain: "akinay-mentorluk-sistemi.firebaseapp.com",
  projectId: "akinay-mentorluk-sistemi",
  storageBucket: "akinay-mentorluk-sistemi.firebasestorage.app",
  messagingSenderId: "714091944617",
  appId: "1:714091944617:web:297042c60a8bd88fd327b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign in error:', error);
    throw error;
  }
};

export const getRedirectResultAuth = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('Get redirect result error:', error);
    return null;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

// Kayıt ol - Firebase Auth + pendingUsers
export const signUp = async (email, password, name) => {
  try {
    // 1. Firebase Auth'da kullanıcı oluştur
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. pendingUsers collection'a ekle (onay bekliyor)
    await setDoc(doc(db, 'pendingUsers', email.toLowerCase()), {
      email: email.toLowerCase(),
      name,
      password, // Şifreyi de kaydet (sonra setPassword ile değiştirilecek)
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    // 3. Auth'dan çıkış yap (kullanıcı giriş yapamasın)
    await signOut(auth);
    
    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: 'Bu e-posta zaten kullanılıyor.' };
    }
    if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Şifre en az 6 karakter olmalıdır.' };
    }
    return { success: false, error: error.message };
  }
};

// Admin: Kayıt isteğini onayla
export const approveUser = async (email, userData) => {
  try {
    const now = new Date().toISOString();
    
    // 1. allowedUsers'a ekle
    await setDoc(doc(db, 'allowedUsers', email.toLowerCase()), {
      email: email.toLowerCase(),
      name: userData.name,
      role: 'user',
      status: 'active',
      industry: userData.industry || '',
      hasContentSupport: userData.hasContentSupport ?? true,
      startDate: userData.startDate || now.split('T')[0],
      createdAt: now
    }, { merge: true });
    
    // 2. users'a ekle (progres takibi için)
    await setDoc(doc(db, 'users', email.toLowerCase()), {
      name: userData.name,
      email: email.toLowerCase(),
      industry: userData.industry || '',
      hasContentSupport: userData.hasContentSupport ?? true,
      startDate: userData.startDate || now.split('T')[0],
      completedSections: [],
      completedSteps: {},
      requestedSections: [],
      createdAt: now,
      updatedAt: now
    }, { merge: true });
    
    // 3. pendingUsers'dan sil
    await deleteDoc(doc(db, 'pendingUsers', email.toLowerCase()));
    
    return { success: true };
  } catch (error) {
    console.error('Approve user error:', error);
    return { success: false, error: error.message };
  }
};

// Admin: Kayıt isteğini reddet ve sil
export const rejectUser = async (email) => {
  try {
    await deleteDoc(doc(db, 'pendingUsers', email.toLowerCase()));
    return { success: true };
  } catch (error) {
    console.error('Reject user error:', error);
    return { success: false, error: error.message };
  }
};

// Admin: Kayıt isteklerini getir
export const getPendingUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'pendingUsers'));
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users.filter(u => u.status === 'pending');
  } catch (error) {
    console.error('Get pending users error:', error);
    return [];
  }
};

// Whitelist kontrolü - Firestore'dan kullanıcı bilgilerini al (case-insensitive)
export const getUserFromWhitelist = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const snapshot = await getDocs(collection(db, 'allowedUsers'));
    const found = snapshot.docs.find(doc => doc.data().email?.toLowerCase() === normalizedEmail);
    return found ? found.data() : null;
  } catch (error) {
    console.error('Whitelist check error:', error);
    return null;
  }
};

// Firestore functions
export const saveUserProgress = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Save progress error:', error);
    return false;
  }
};

export const getUserProgress = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Get progress error:', error);
    return null;
  }
};

// Admin: Yeni danışan ekle (Firestore)
export const addClientToFirestore = async (clientData) => {
  try {
    const { email, name, industry, hasContentSupport, startDate } = clientData;
    const now = new Date().toISOString();

    // 1. allowedUsers'a ekle (auth için whitelist)
    const allowedUsersRef = collection(db, 'allowedUsers');
    await setDoc(doc(allowedUsersRef), {
      email: email.toLowerCase(),
      name,
      role: 'user',
      status: 'active',
      industry: industry || '',
      hasContentSupport: hasContentSupport ?? true,
      createdAt: now
    });

    // 2. users'a ekle (progres takibi için)
    await setDoc(doc(db, 'users', email.toLowerCase()), {
      name,
      email: email.toLowerCase(),
      industry: industry || '',
      hasContentSupport: hasContentSupport ?? true,
      startDate: startDate || now.split('T')[0],
      completedSections: [],
      completedSteps: {},
      requestedSections: [],
      createdAt: now,
      updatedAt: now
    });

    return { success: true };
  } catch (error) {
    console.error('Add client error:', error);
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
