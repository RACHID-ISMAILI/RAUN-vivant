
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const capsulesList = document.getElementById("capsules-list");

async function loadCapsules() {
  const q = query(collection(db, "capsules"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  capsulesList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const p = document.createElement("p");
    p.textContent = "🌀 " + data.texte;
    capsulesList.appendChild(p);
  });
}

loadCapsules();
