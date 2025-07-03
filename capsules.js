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
container.innerHTML = "";

const q = query(collection(db, "capsules"), orderBy("date", "desc"));
const snapshot = await getDocs(q);

snapshot.forEach(doc => {
  const data = doc.data();
  const div = document.createElement("div");
  div.className = "capsule";
  div.innerHTML = `
    <div class="texte">${data.texte}</div>
    <div class="date">${data.date?.toDate().toLocaleString() || ''}</div>
  `;
  container.appendChild(div);
});
