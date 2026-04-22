import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

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
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign in error:', error);
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

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
