import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiP8fcI5D9H3GSGF-5EUhKUkRykIcwdt8",
  authDomain: "smart-governance-system.firebaseapp.com",
  projectId: "smart-governance-system",
  storageBucket: "smart-governance-system.firebasestorage.app",
  messagingSenderId: "443774884218",
  appId: "1:443774884218:web:bf808da46301a34d0c5ec3",
  measurementId: "G-RZRBP3840M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
