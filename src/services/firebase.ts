import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAkUdhmZULMyf4rEdh2vxBmXePpnbyNtR0",
  authDomain: "letmeask-3318c.firebaseapp.com",
  databaseURL: "https://letmeask-3318c-default-rtdb.firebaseio.com",
  projectId: "letmeask-3318c",
  storageBucket: "letmeask-3318c.appspot.com",
  messagingSenderId: "119020661917",
  appId: "1:119020661917:web:ed2b3273b6c6b54c237874"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
