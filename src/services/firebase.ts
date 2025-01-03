import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, UserCredential, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, Auth, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { getAnalytics, initializeAnalytics } from "firebase/analytics";
import { firebaseConfig } from '../config/firebase';
import { Product } from '../types';

let app: any; // Declare app variable outside the async function
let db: any;
let auth: any;

const initializeFirebase = async () => {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    app = getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  }
  await initializeAnalytics(app);
};

// Helper function to get Firestore collection
const getCollection = (collectionName: string) => collection(db, collectionName);

// Firestore service functions
export const firestoreService = {
  getAll: async <T>(collectionName: string): Promise<T[]> => {
    await initializeFirebase();
    const querySnapshot = await getDocs(getCollection(collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  },
  create: async <T, U>(collectionName: string, data: T): Promise<U> => {
    await initializeFirebase();
    const docRef = await addDoc(getCollection(collectionName), data);
    return { id: docRef.id, ...data } as U;
  },
  update: async <T>(collectionName: string, id: string, data: T): Promise<T> => {
    await initializeFirebase();
    await updateDoc(doc(db, collectionName, id), data);
    return { id, ...data } as T;
  },
  delete: async (collectionName: string, id: string): Promise<void> => {
    await initializeFirebase();
    await deleteDoc(doc(db, collectionName, id));
  },
};

export const firestoreServiceProduct = {
  getAll: async (): Promise<Product[]> => {
    await initializeFirebase();
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await initializeFirebase();
    const docRef = await addDoc(collection(db, "products"), product);
    return { id: docRef.id, ...product } as Product;
  },
  update: async (id: string, product: Product): Promise<Product> => {
    await initializeFirebase();
    await updateDoc(doc(db, "products", id), product);
    return { id, ...product } as Product;
  },
  delete: async (id: string): Promise<void> => {
    await initializeFirebase();
    await deleteDoc(doc(db, "products", id));
  },
};


// Authentication functions
export const loginWithEmail = async (email: string, password: string, rememberMe: boolean): Promise<UserCredential | null> => {
  await initializeFirebase();
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (error) {
    console.error("Login with email error:", error);
    return null;
  }
};

export const registerWithEmail = async (email: string, password: string, name: string): Promise<UserCredential | null> => {
  await initializeFirebase();
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName: name });
    if (response.user) {
      await setDoc(doc(db, "users", response.user.uid), {
        role: 'user',
      });
    }
    return response;
  } catch (error) {
    console.error("Register with email error:", error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  await initializeFirebase();
  await signOut(auth);
};

// Google Sign-In
export const loginWithGoogle = async (rememberMe: boolean): Promise<UserCredential | null> => {
  await initializeFirebase();
  const provider = new GoogleAuthProvider();
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          role: 'user',
        });
      }
    }
    return result;
  } catch (error) {
    console.error("Google Sign-In error:", error);
    return null;
  }
};

// Facebook Sign-In
export const loginWithFacebook = async (rememberMe: boolean): Promise<UserCredential | null> => {
  await initializeFirebase();
  const provider = new FacebookAuthProvider();
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          role: 'user',
        });
      }
    }
    return result;
  } catch (error) {
    console.error("Facebook Sign-In error:", error);
    return null;
  }
};

export const getCurrentUser = async () => {
  await initializeFirebase();
  return auth.currentUser;
}

export const updateProfileUser = async (name: string) => {
  await initializeFirebase();
  await updateProfile(auth.currentUser, { displayName: name });
}

export const getUserRole = async (uid: string): Promise<'user' | 'admin'> => {
  await initializeFirebase();
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists() && userDoc.data()?.role) {
    return userDoc.data().role;
  }
  return 'user';
};

export const onAuthChange = (callback: (user: any) => void) => {
  let unsubscribe: any;
  const setupAuthListener = async () => {
    await initializeFirebase();
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'user';
        callback({ ...user, role });
      } else {
        callback(null);
      }
    });
  };

  setupAuthListener();

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

export const checkInitialAuth = (callback: (user: any) => void) => {
  let unsubscribe: any;
  const setupAuthListener = async () => {
    await initializeFirebase();
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'user';
        callback({ ...user, role });
      } else {
        callback(null);
      }
    });
  };

  setupAuthListener();

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};
