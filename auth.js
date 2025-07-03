// auth.js
import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const loginForm = document.getElementById('login-form');
const protectedContent = document.getElementById('protected');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginForm.style.display = 'none';
      protectedContent.style.display = 'block';
    })
    .catch((error) => {
      alert("Erreur de connexion : " + error.message);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginForm.style.display = 'none';
    protectedContent.style.display = 'block';
  } else {
    loginForm.style.display = 'block';
    protectedContent.style.display = 'none';
  }
});
