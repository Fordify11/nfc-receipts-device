import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnZ-3x0j5ME1S0wUTOGsmDOtQr3UZYp2w",
  authDomain: "nfc-receipts.firebaseapp.com",
  projectId: "nfc-receipts",
  storageBucket: "nfc-receipts.firebasestorage.app",
  messagingSenderId: "420203098913",
  appId: "1:420203098913:web:bb8e49fcef636a21200460"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, firebaseConfig };

