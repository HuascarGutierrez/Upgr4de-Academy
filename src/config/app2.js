// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfigB = {
  apiKey: "AIzaSyDuozgXffE096UnFru3XFWm9GlviIkA5Wk",
  authDomain: "sapi2-46621.firebaseapp.com",
  projectId: "sapi2-46621",
  storageBucket: "sapi2-46621.firebasestorage.app",
  messagingSenderId: "107650752564",
  appId: "1:107650752564:web:141028d99e497f296caa61",
  measurementId: "G-MBFS1S20RK"
};

// Initialize Firebase
import { getApp } from "firebase/app";

let appB;
try {
  appB = getApp('secondaryApp');
} catch (e) {
  appB = initializeApp(firebaseConfigB, 'secondaryApp');
}
export const storage = getStorage(appB);

