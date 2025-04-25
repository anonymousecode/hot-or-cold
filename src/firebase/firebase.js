// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 👈 add this

const firebaseConfig = {
  apiKey: "AIzaSyD-Z7CPRInCDFdhrI7dWPqAx0HQvdHvktw",
  authDomain: "hotorcold-b6457.firebaseapp.com",
  projectId: "hotorcold-b6457",
  storageBucket: "hotorcold-b6457.appspot.com", // 👈 fixed the typo here too
  messagingSenderId: "745792596735",
  appId: "1:745792596735:web:b86da744192332aa0d7aca"
};

const app = initializeApp(firebaseConfig);

// 👇 this is what you were missing
const db = getFirestore(app);

export { db };
