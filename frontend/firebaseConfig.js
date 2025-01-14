// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Import other Firebase services you need (e.g., Storage, Auth)
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMUlRTLVwfmoAEIZ1CojC8ZkkxxiO8Uq0",
  authDomain: "filerium-c2f77.firebaseapp.com",
  projectId: "filerium-c2f77",
  storageBucket: "filerium-c2f77.firebasestorage.app",
  messagingSenderId: "237782669547",
  appId: "1:237782669547:web:d2c633b91eba58d909c6ae",
  measurementId: "G-MKHSMDYD4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (Optional)
const analytics = getAnalytics(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage, analytics, app };
