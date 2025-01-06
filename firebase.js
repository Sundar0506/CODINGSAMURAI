// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Firebase Authentication
import { getFirestore } from "firebase/firestore";  // Firestore
import { getDatabase } from "firebase/database";  // Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPKqpyxRNeNXznecLxpldb8MWTfYBG4hw",
  authDomain: "realtimechatapp-c16ec.firebaseapp.com",
  projectId: "realtimechatapp-c16ec",
  storageBucket: "realtimechatapp-c16ec.firebasestorage.app",
  messagingSenderId: "948133824044",
  appId: "1:948133824044:web:024600dfb966355354b389"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // Firebase Authentication
const db = getFirestore(app);  // Firestore Database
const rtdb = getDatabase(app);  // Realtime Database (if needed)

// Export Firebase services
export { auth, db, rtdb };
