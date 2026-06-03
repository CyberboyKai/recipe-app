import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyDtpLXMdWlKwraJM9gRFkEFcOv52mVOGN8',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'recipe-app-week3.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'recipe-app-week3',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'recipe-app-week3.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '293677228457',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:293677228457:web:86d3fd9a77fe116e4e64b8',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
