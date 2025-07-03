// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {'apiKey': 'AIzaSyXXXXXXX-test-key', 'authDomain': 'raun-vivant.firebaseapp.com', 'projectId': 'raun-vivant', 'storageBucket': 'raun-vivant.appspot.com', 'messagingSenderId': '1234567890', 'appId': '1:1234567890:web:abcdefghij123456'};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
