// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGUTrelT7oYOVO4uehP3hdDV_R6v6zFlY",
  authDomain: "ayur4life-3cf26.firebaseapp.com",
  projectId: "ayur4life-3cf26",
  storageBucket: "ayur4life-3cf26.firebasestorage.app",
  messagingSenderId: "140387191450",
  appId: "1:140387191450:web:46f02814e50f48f0926d23",
  measurementId: "G-QBNFHNBJR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);