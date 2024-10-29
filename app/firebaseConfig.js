
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {

  apiKey: "AIzaSyCwfbQo16p91npSCrlon1RANcCqoS2lNpo",

  authDomain: "motalk-84314.firebaseapp.com",

  projectId: "motalk-84314",

  storageBucket: "motalk-84314.appspot.com",

  messagingSenderId: "76728234283",

  appId: "1:76728234283:web:57ee270ef8f3354f1cd56e",

  measurementId: "G-TDHWC2X027"

};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, firestore ,storage}; // Export auth and firestore for use in other components


