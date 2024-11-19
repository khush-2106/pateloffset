import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoYYMFrD8qSXLamC2SdsTz3batscgkzkk",
  authDomain: "pateloffset-b5921.firebaseapp.com",
  projectId: "pateloffset-b5921",
  storageBucket: "pateloffset-b5921.firebasestorage.app",
  messagingSenderId: "331246621751",
  appId: "1:331246621751:web:d438d8329c5a9e12721bb2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);