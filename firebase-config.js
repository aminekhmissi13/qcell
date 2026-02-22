// ===========================
// Firebase Configuration
// ===========================

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmRFi4kiiURfMIly-UXkCus17qEPKzJ8c",
  authDomain: "cell-f1e56.firebaseapp.com",
  projectId: "cell-f1e56",
  storageBucket: "cell-f1e56.firebasestorage.app",
  messagingSenderId: "419649278737",
  appId: "1:419649278737:web:845f543f43b72024aeb2b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log('Firebase initialized successfully');
