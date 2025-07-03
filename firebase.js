// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network",
  storageBucket: "raun-network.firebasestorage.app",
  messagingSenderId: "541416001018",
  appId: "1:541416001018:web:c1d8518ec9181631206843",
  measurementId: "G-90SBGYPPZD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
