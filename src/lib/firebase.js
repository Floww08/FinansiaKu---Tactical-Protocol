import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB-yK2xPUlb1Fe4auloGx7_4WlBueVCxAQ",
    authDomain: "finansialku-flow.firebaseapp.com",
    projectId: "finansialku-flow",
    storageBucket: "finansialku-flow.firebasestorage.app",
    messagingSenderId: "615821780934",
    appId: "1:615821780934:web:e58cc95a24bf06af6134c7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); // Ekspor akses Database

export { auth, db };