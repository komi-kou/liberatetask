// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKDoRrQn4wEOvl6rFSJ89v7_ICQR53t6w",
  authDomain: "liberate-7eaf7.firebaseapp.com",
  projectId: "liberate-7eaf7",
  storageBucket: "liberate-7eaf7.firebasestorage.app",
  messagingSenderId: "888918932910",
  appId: "1:888918932910:web:e895b74876b8a58a7b1c3f",
  measurementId: "G-WRYPVSJY34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
