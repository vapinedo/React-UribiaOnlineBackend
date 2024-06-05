import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDd6cq_TQiTBvZr--Azdj3XXNbFgjTyWgA",
  authDomain: "loan-tracker-14253.firebaseapp.com",
  projectId: "loan-tracker-14253",
  storageBucket: "loan-tracker-14253.appspot.com",
  messagingSenderId: "428250568481",
  appId: "1:428250568481:web:e4a1600f5f57177f9b5060",
};

export const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
