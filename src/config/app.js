// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn9g44c7VhWqBpJm7zyhvhKELqOA21xRM",
  authDomain: "sapi-5c389.firebaseapp.com",
  projectId: "sapi-5c389",
  storageBucket: "sapi-5c389.firebasestorage.app",
  messagingSenderId: "967401641861",
  appId: "1:967401641861:web:3059439c849d80ecd216ec",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export { db }
