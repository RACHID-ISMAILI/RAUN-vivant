
const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const PASSWORD = "raun2025"; // à modifier si besoin

function checkPassword() {
  const input = document.getElementById("admin-password").value;
  if (input === PASSWORD) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    loadComments();
  } else {
    alert("Mot de passe incorrect.");
  }
}

document.getElementById("new-capsule-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  await db.collection("capsules").add({
    title,
    content,
    readCount: 0,
    comments: []
  });
  alert("Capsule ajoutée !");
  document.getElementById("new-capsule-form").reset();
});

function loadComments() {
  const section = document.getElementById("comments-section");
  db.collection("capsules").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.comments && data.comments.length > 0) {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${data.title}</h3><ul>` +
          data.comments.map(c => `<li><b>${c.name}</b> : ${c.text} <i>(${new Date(c.timestamp).toLocaleString()})</i></li>`).join('') +
          `</ul><hr>`;
        section.appendChild(div);
      }
    });
  });
}
