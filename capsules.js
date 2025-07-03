
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network",
  storageBucket: "raun-network.appspot.com",
  messagingSenderId: "541416001018",
  appId: "1:541416001018:web:c1d8518ec9181631206843",
  measurementId: "G-90SBGYPPZD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchCapsules() {
  const querySnapshot = await getDocs(collection(db, "capsules"));
  return querySnapshot.docs.map(doc => doc.data());
}

async function loadCapsules() {
  const container = document.getElementById("capsules-container");
  const searchTerm = document.getElementById("search").value.toLowerCase();
  container.innerHTML = "";
  const capsules = await fetchCapsules();
  capsules
    .filter(c => c.texte && c.texte.toLowerCase().includes(searchTerm))
    .forEach(c => {
      const div = document.createElement("div");
      div.className = "capsule";
      div.textContent = c.texte;
      container.appendChild(div);
    });
}

window.loadCapsules = loadCapsules;
document.addEventListener("DOMContentLoaded", loadCapsules);
document.getElementById("search").addEventListener("input", loadCapsules);
    