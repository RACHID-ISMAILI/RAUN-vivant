import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveCapsule = async () => {
  const text = document.getElementById("capsuleText").value;
  if (!text) return alert("Capsule vide !");
  await addDoc(collection(db, "capsules"), {
    texte: text,
    date: serverTimestamp()
  });
  alert("🌱 Capsule enregistrée !");
  document.getElementById("capsuleText").value = "";
};
