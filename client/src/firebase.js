// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-f89d8.firebaseapp.com",
  projectId: "mernestate-f89d8",
  storageBucket: "mernestate-f89d8.appspot.com",
  messagingSenderId: "912458558646",
  appId: "1:912458558646:web:d672db6ec56e99a1f44a17"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);