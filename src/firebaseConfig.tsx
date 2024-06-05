import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "react-cursos-187dc",
  messagingSenderId: "791208906607",
  storageBucket: "react-cursos-187dc.appspot.com",
  authDomain: "react-cursos-187dc.firebaseapp.com",
  apiKey: "AIzaSyD1SKumwaNQB8RaZUftyyz1l4duS8nPQPU",
  appId: "1:791208906607:web:e642a487ddf1b4b4f1a29a"
};

export const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default { firebaseApp, db, storage };
