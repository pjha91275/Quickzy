import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkwtCbIaGXhaEyL5wEMg2SpkU9nefBmmg",
  authDomain: "quickzy-96081.firebaseapp.com",
  projectId: "quickzy-96081",
  storageBucket: "quickzy-96081.firebasestorage.app",
  messagingSenderId: "10699245719",
  appId: "1:10699245719:web:214919d020c85e4c1341d2"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);


