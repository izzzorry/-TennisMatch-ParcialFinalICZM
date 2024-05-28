
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCGfWJc9J4qNitHErJhX4QR57-WQm0elu8",
  authDomain: "tennismatch-c0886.firebaseapp.com",
  projectId: "tennismatch-c0886",
  storageBucket: "tennismatch-c0886.appspot.com",
  messagingSenderId: "207479765555",
  appId: "1:207479765555:web:08706e65471c1893240146"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



