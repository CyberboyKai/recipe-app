import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtpLXMdWlKwraJM9gRFkEFcOv52mVOGN8",
  authDomain: "recipe-app-week3.firebaseapp.com",
  projectId: "recipe-app-week3",
  storageBucket: "recipe-app-week3.firebasestorage.app",
  messagingSenderId: "293677228457",
  appId: "1:293677228457:web:86d3fd9a77fe116e4e64b8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);