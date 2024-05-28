
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 


const firebaseConfig = {
  apiKey: "AIzaSyCGfWJc9J4qNitHErJhX4QR57-WQm0elu8",
  authDomain: "tennismatch-c0886.firebaseapp.com",
  projectId: "tennismatch-c0886",
  storageBucket: "tennismatch-c0886.appspot.com",
  messagingSenderId: "207479765555",
  appId: "1:207479765555:web:08706e65471c1893240146"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inicializar storage

export { db, auth, storage };



