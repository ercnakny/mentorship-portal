import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzik-WQRwG6yi7rWqhFrJGN2H4lMBH2Z8",
  authDomain: "akinay-mentorluk-sistemi.firebaseapp.com",
  projectId: "akinay-mentorluk-sistemi",
  storageBucket: "akinay-mentorluk-sistemi.firebasestorage.app",
  messagingSenderId: "714091944617",
  appId: "1:714091944617:web:297042c60a8bd88fd327b8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Giriş yap
export const signInWithEmail = async (email, password) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    return result.user;
  } catch (error) {
    console.error('Email sign in error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

// Kayıt ol
export const signUp = async (email, password, name) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // 1. Firebase Auth'da kullanıcı oluştur
    const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    
    // 2. pendingUsers collection'a ekle
    await setDoc(doc(db, 'pendingUsers', normalizedEmail), {
      email: normalizedEmail,
      name: name || 'İsimsiz',
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    // 3. Auth'dan çıkış yap
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
    const normalizedEmail = email.toLowerCase().trim();
    
    // 1. allowedUsers'a ekle
    await setDoc(doc(db, 'allowedUsers', normalizedEmail), {
      email: normalizedEmail,
      name: userData.name || 'İsimsiz',
      role: 'user',
      status: 'active',
      industry: userData.industry || '',
      hasContentSupport: userData.hasContentSupport ?? true,
      startDate: userData.startDate || now.split('T')[0],
      createdAt: now
    });
    
    // 2. users'a ekle (progres takibi için)
    await setDoc(doc(db, 'users', normalizedEmail), {
      name: userData.name || 'İsimsiz',
      email: normalizedEmail,
      industry: userData.industry || '',
      hasContentSupport: userData.hasContentSupport ?? true,
      startDate: userData.startDate || now.split('T')[0],
      completedSections: [],
      completedSteps: {},
      requestedSections: [],
      createdAt: now,
      updatedAt: now
    });
    
    // 3. pendingUsers'dan sil
    await deleteDoc(doc(db, 'pendingUsers', normalizedEmail));
    
    return { success: true };
  } catch (error) {
    console.error('Approve user error:', error);
    return { success: false, error: error.message };
  }
};

// Admin: Kayıt isteğini reddet
export const rejectUser = async (email) => {
  try {
    await deleteDoc(doc(db, 'pendingUsers', email.toLowerCase().trim()));
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get pending users error:', error);
    return [];
  }
};

// Admin: Tüm onaylı kullanıcıları getir
export const getAllAllowedUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'allowedUsers'));
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users.filter(u => u.role !== 'admin');
  } catch (error) {
    console.error('Get all allowed users error:', error);
    return [];
  }
};

// Whitelist kontrolü
export const getUserFromWhitelist = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const docRef = doc(db, 'allowedUsers', normalizedEmail);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
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
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Get progress error:', error);
    return null;
  }
};

// Admin: Yeni danışan ekle
export const addClientToFirestore = async (clientData) => {
  try {
    const { email, name, industry, hasContentSupport, startDate } = clientData;
    const normalizedEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    await setDoc(doc(db, 'allowedUsers', normalizedEmail), {
      email: normalizedEmail,
      name,
      role: 'user',
      status: 'active',
      industry: industry || '',
      hasContentSupport: hasContentSupport ?? true,
      createdAt: now
    });

    await setDoc(doc(db, 'users', normalizedEmail), {
      name,
      email: normalizedEmail,
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
