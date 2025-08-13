// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsl3TtVwgpmUzx7TBdjhgQQZapJGX5abk",
    authDomain: "chat-app-11ece.firebaseapp.com",
    projectId: "chat-app-11ece",
    storageBucket: "chat-app-11ece.firebasestorage.app",
    messagingSenderId: "213429201459",
    appId: "1:213429201459:web:f5400087fa209f0d881146",
    measurementId: "G-KMQPQXD8R2"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }

