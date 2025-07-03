
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const container = document.getElementById("capsules-container");
const searchInput = document.getElementById("search");

window.fetchCapsules = async () => {
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "capsules"));
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.texte) return;
    const div = document.createElement("div");
    div.className = "capsule";
    div.innerHTML = `
      <p>${data.texte}</p>
      <div class="share-buttons">
        <a href="https://wa.me/?text=${encodeURIComponent(data.texte)}" target="_blank">📱</a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://raun.com&title=Capsule&summary=${encodeURIComponent(data.texte)}" target="_blank">💼</a>
        <a href="mailto:?subject=Capsule RAUN&body=${encodeURIComponent(data.texte)}">✉️</a>
      </div>`;
    container.appendChild(div);
  });
};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  Array.from(container.children).forEach(capsule => {
    const match = capsule.textContent.toLowerCase().includes(query);
    capsule.style.display = match ? "block" : "none";
  });
});

fetchCapsules();
