// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "poker-pwa-assignment.firebaseapp.com",
  projectId: "poker-pwa-assignment",
  storageBucket: "poker-pwa-assignment.appspot.com",
  messagingSenderId: "789393184677",
  appId: "1:789393184677:web:39840b7ef681296b5e7a4c",
  measurementId: "G-BVBF54TPJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export default firestore