// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKsQebn6SeSM3uWVA7zHCgN2slYE_vwn8",
  authDomain: "shopvue-a9c51.firebaseapp.com",
  projectId: "shopvue-a9c51",
  storageBucket: "shopvue-a9c51.firebasestorage.app",
  messagingSenderId: "113313329210",
  appId: "1:113313329210:web:8a996d47dac45338f64503",
  measurementId: "G-BF0KB1QNC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { app as firebaseapp, db, auth }