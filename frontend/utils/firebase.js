// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "viwetubelogin.firebaseapp.com",
  projectId: "viwetubelogin",
  storageBucket: "viwetubelogin.firebasestorage.app",
  messagingSenderId: "61879293308",
  appId: "1:61879293308:web:19a589c017622c692280f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
const provider=new GoogleAuthProvider()

export {auth,provider};
