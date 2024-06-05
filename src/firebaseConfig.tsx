import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1SKumwaNQB8RaZUftyyz1l4duS8nPQPU",
  authDomain: "react-cursos-187dc.firebaseapp.com",
  projectId: "react-cursos-187dc",
  storageBucket: "react-cursos-187dc.appspot.com",
  messagingSenderId: "791208906607",
  appId: "1:791208906607:web:e642a487ddf1b4b4f1a29a"
};

export const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
