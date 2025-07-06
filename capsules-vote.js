document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const capsulesContainer = document.getElementById("capsules");

  function afficherCapsules() {
    db.collection("capsules").orderBy("timestamp", "desc").get()
      .then((querySnapshot) => {
        capsulesContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const texte = data.text || "Capsule vide";
          const id = doc.id;
          const votesUp = data.votesUp || 0;
          const votesDown = data.votesDown || 0;
          const readCount = data.readCount || 0;

          const capsule = document.createElement("div");
          capsule.className = "capsule";
          capsule.innerHTML = `
            <p>${texte}</p>
            <p>👁️ Lectures : ${readCount}</p>
            <p>
              <button onclick="vote('${id}', 'votesUp')">👍 <span id="up-${id}">${votesUp}</span></button>
              <button onclick="vote('${id}', 'votesDown')">👎 <span id="down-${id}">${votesDown}</span></button>
            </p>
            <textarea id="comment-${id}" placeholder="💬 Ton commentaire..."></textarea>
            <button onclick="addComment('${id}')">Commenter</button>
            <div id="comments-${id}"></div>
          `;
          capsulesContainer.appendChild(capsule);
          loadComments(id);

          const key = "read_" + id;
          if (!localStorage.getItem(key)) {
            db.collection("capsules").doc(id).update({
              readCount: firebase.firestore.FieldValue.increment(1)
            }).then(() => {
              localStorage.setItem(key, "1");
            });
          }
        });
      })
      .catch((error) => {
        capsulesContainer.innerHTML =
          "<p style='color:red;'>Erreur de chargement : " + error.message + "</p>";
      });
  }

  window.vote = function(id, type) {
    const key = "voted_" + id;
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

  window.addComment = function(id) {
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

  afficherCapsules();
});
