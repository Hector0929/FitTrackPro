// Firebase 初始化配置
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD3IobI0YAmRyp5NxOSoRQ0dRH0Rvr4vFk",
    authDomain: "fit-track-pro-f7326.firebaseapp.com",
    projectId: "fit-track-pro-f7326",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
