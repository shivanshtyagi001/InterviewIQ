import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCM5DkI3Z5Vo3t8-SoPDqetahYiPhsap4k",
    authDomain: "interviewiq-d08cb.firebaseapp.com",
    projectId: "interviewiq-d08cb",
    storageBucket: "interviewiq-d08cb.firebasestorage.app",
    messagingSenderId: "632082986018",
    appId: "1:632082986018:web:3f8b7c7a2397ee0953467b",
    measurementId: "G-JG0E1QCV9C"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };