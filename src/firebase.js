// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMmVA0i9MKxyLv_9C8H23opWf5CllCp4I",
  authDomain: "gestion-financiera-220c7.firebaseapp.com",
  projectId: "gestion-financiera-220c7",
  storageBucket: "gestion-financiera-220c7.firebasestorage.app",
  messagingSenderId: "156585765263",
  appId: "1:156585765263:web:cc4054b94d5fd80c9703fa",
  measurementId: "G-ZPTWDBT6ES"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);