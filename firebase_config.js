// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGcjjgvRFCecIwmYOLWLE769KkqsunuQo",
  authDomain: "weconnect-34533.firebaseapp.com",
  projectId: "weconnect-34533",
  storageBucket: "weconnect-34533.firebasestorage.app",
  messagingSenderId: "688085302109",
  appId: "1:688085302109:web:f5410f29bd152084b206b4",
  measurementId: "G-GYGDJ9M12T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);