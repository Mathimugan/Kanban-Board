// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCkiDPqmaPRwtrk6_5-wclP5V-15ciURnM",
    authDomain: "thiruchendhur-murugan.firebaseapp.com",
    projectId: "thiruchendhur-murugan",
    storageBucket: "thiruchendhur-murugan.firebasestorage.app",
    messagingSenderId: "140177007651",
    appId: "1:140177007651:web:a73b34fbfd0c55d1f5bd96",
    measurementId: "G-XYY853RPD7"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
