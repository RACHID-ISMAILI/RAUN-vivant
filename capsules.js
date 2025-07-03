import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

const container = document.getElementById("capsules-container");
const searchInput = document.getElementById("searchInput");

async function afficherCapsules() {
  container.innerHTML = "";
  const q = query(collection(db, "capsules"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  const capsules = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    capsules.push({
      texte: data.texte,
      date: data.date?.toDate()
    });
  });

  function render(filteredCapsules) {
    container.innerHTML = "";
    filteredCapsules.forEach(capsule => {
      const div = document.createElement("div");
      div.className = "capsule";
      const encodedText = encodeURIComponent(capsule.texte);
      div.innerHTML = `
        <div class="texte">${capsule.texte}</div>
        <div class="date">${capsule.date?.toLocaleString() || ''}</div>
        <div class="share">
          <a href="https://wa.me/?text=${encodedText}" target="_blank">📲 WhatsApp</a>
          <a href="mailto:?body=${encodedText}" target="_blank">✉️ Email</a>
        </div>
      `;
      container.appendChild(div);
    });
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = capsules.filter(c =>
      c.texte.toLowerCase().includes(term)
    );
    render(filtered);
  });

  render(capsules);
}

afficherCapsules();
