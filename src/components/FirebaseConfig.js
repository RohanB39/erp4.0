import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, deleteDoc, addDoc, updateDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_bnB2Zz6roqq9PqrFfcEFPcbQ1-QQSj0",
  authDomain: "erp0-509d7.firebaseapp.com",
  projectId: "erp0-509d7",
  storageBucket: "erp0-509d7.appspot.com",
  messagingSenderId: "384769236931",
  appId: "1:384769236931:web:bfbecd3f8069d53fd86776",
  measurementId: "G-XXNXXMMD4K"
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, fireDB, auth, query, where, addDoc, collection, getDocs, deleteDoc, storage, doc, updateDoc, ref, uploadBytes, getDownloadURL };