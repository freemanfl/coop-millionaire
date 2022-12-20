// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";
import { getDatabase, set, ref, onDisconnect, onValue } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVvZ55WHTO2I51z-bEQ1OOgIRikOz6Ecg",
  authDomain: "millionaire-66cdb.firebaseapp.com",
  projectId: "millionaire-66cdb",
  storageBucket: "millionaire-66cdb.appspot.com",
  messagingSenderId: "957601266601",
  appId: "1:957601266601:web:975e4ae6e4370493d762b8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app, "https://millionaire-66cdb-default-rtdb.europe-west1.firebasedatabase.app/");