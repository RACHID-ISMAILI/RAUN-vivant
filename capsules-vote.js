
document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const container = document.getElementById("capsules");

  async function loadCapsules() {
    const snapshot = await db.collection("capsules").orderBy("timestamp", "desc").get();
    container.innerHTML = "";
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      const id = doc.id;

      // Ajouter votesUp et votesDown si manquants
      if (data.votesUp === undefined || data.votesDown === undefined) {
        await db.collection("capsules").doc(id).set({
          votesUp: data.votesUp || 0,
          votesDown: data.votesDown || 0
        }, { merge: true });
      }

      const capsuleDiv = document.createElement("div");
      capsuleDiv.className = "capsule";
      capsuleDiv.innerHTML = `
        <p>${data.text || "..."}</p>
        <p>
          <button onclick="vote('${id}', 'votesUp')">👍 <span id="up-${id}">${data.votesUp || 0}</span></button>
          <button onclick="vote('${id}', 'votesDown')">👎 <span id="down-${id}">${data.votesDown || 0}</span></button>
        </p>
        <textarea id="comment-${id}" placeholder="💬 Ton commentaire..."></textarea>
        <button onclick="addComment('${id}')">Commenter</button>
        <div id="comments-${id}"></div>
      `;
      container.appendChild(capsuleDiv);
      loadComments(id);
    });
  }

  window.vote = function (id, type) {
    const key = "voted-" + id;
    if (localStorage.getItem(key)) {
      alert("Tu as déjà voté !");
      return;
    }
    db.collection("capsules").doc(id).update({
      [type]: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
      localStorage.setItem(key, "1");
      const span = document.getElementById((type === "votesUp" ? "up-" : "down-") + id);
      span.textContent = parseInt(span.textContent) + 1;
    });
  };

  window.addComment = function (id) {
    const textarea = document.getElementById("comment-" + id);
    const message = textarea.value.trim();
    if (!message) return;
    db.collection("commentaires").add({
      capsuleId: id,
      message: message,
      timestamp: new Date()
    }).then(() => {
      textarea.value = "";
      loadComments(id);
    });
  };

  async function loadComments(id) {
    const container = document.getElementById("comments-" + id);
    const snapshot = await db.collection("commentaires")
      .where("capsuleId", "==", id)
      .orderBy("timestamp", "desc")
      .limit(5)
      .get();
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "comment";
      div.textContent = "💬 " + data.message;
      container.appendChild(div);
    });
  }

  loadCapsules();
});
