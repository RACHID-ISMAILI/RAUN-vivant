
const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const PASSWORD = "raun2025";

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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("new-capsule-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
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
      form.reset();
    });
  }
});

function loadComments() {
  const section = document.getElementById("comments-section");
  section.innerHTML = "";
  db.collection("capsules").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.comments && data.comments.length > 0) {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${data.title || "Sans titre"}</h3><ul id="list-${doc.id}"></ul><hr>`;
        section.appendChild(div);
        const list = div.querySelector(`#list-${doc.id}`);

        data.comments.forEach((c, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <b>${c.name}</b> : ${c.text} <i>(${new Date(c.timestamp).toLocaleString()})</i>
            ${c.reply ? `<br><b>↪️ Réponse admin :</b> ${c.reply}` : ""}
            <br>
            <input type="text" placeholder="Répondre..." id="reply-${doc.id}-${index}" />
            <button onclick="replyComment('${doc.id}', ${index})">Répondre</button>
            <button onclick="deleteComment('${doc.id}', ${index})">🗑 Supprimer</button>
          `;
          list.appendChild(li);
        });
      }
    });
  });
}

function replyComment(docId, index) {
  const input = document.getElementById(`reply-${docId}-${index}`);
  const replyText = input.value;
  if (!replyText) return;

  db.collection("capsules").doc(docId).get().then(doc => {
    const data = doc.data();
    data.comments[index].reply = replyText;
    db.collection("capsules").doc(docId).update({
      comments: data.comments
    }).then(() => {
      alert("Réponse ajoutée !");
      loadComments();
    });
  });
}

function deleteComment(docId, index) {
  if (!confirm("Confirmer la suppression de ce commentaire ?")) return;

  db.collection("capsules").doc(docId).get().then(doc => {
    const data = doc.data();
    data.comments.splice(index, 1);
    db.collection("capsules").doc(docId).update({
      comments: data.comments
    }).then(() => {
      alert("Commentaire supprimé.");
      loadComments();
    });
  });
}
