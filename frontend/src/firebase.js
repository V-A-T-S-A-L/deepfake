import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD6CIk5biMALk_g9sjpsB5VzYhmi72HqDo",
    authDomain: "veracity-f10ae.firebaseapp.com",
    projectId: "veracity-f10ae",
    storageBucket: "veracity-f10ae.firebasestorage.app",
    messagingSenderId: "694321200867",
    appId: "1:694321200867:web:ed1a9121bd26f1e9fd8fd6",
    measurementId: "G-G5GWL3VWJ8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize providers correctly
export const providerGoogle = new GoogleAuthProvider();
export const providerFacebook = new FacebookAuthProvider();
export const providerApple = new OAuthProvider('apple.com');

export { auth };
