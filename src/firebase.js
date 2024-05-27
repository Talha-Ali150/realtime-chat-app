import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvOBb-qiLrhcw8vp5LxOWVMIUcSgPq1VI",
  authDomain: "realtime-chat-app-5b72c.firebaseapp.com",
  projectId: "realtime-chat-app-5b72c",
  storageBucket: "realtime-chat-app-5b72c.appspot.com",
  messagingSenderId: "198008129215",
  appId: "1:198008129215:web:4d7c977a934ddf01f1680a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
