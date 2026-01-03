import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCY7gHYGzhgFPBQm99syARDbnflMJbloSc",
    authDomain: "task-c9560.firebaseapp.com",
    projectId: "task-c9560",
    storageBucket: "task-c9560.firebasestorage.app",
    messagingSenderId: "719368236286",
    appId: "1:719368236286:web:04f765f5429def1c59c9af",
    measurementId: "G-WN2J3K527D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
