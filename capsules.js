
document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const container = document.getElementById("capsules");

  db.collection("capsules").orderBy("timestamp", "desc").get()
    .then(snapshot => {
      container.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const contenu =
          data.text?.trim() ||
          data.content?.trim() ||
          data.rappel?.trim() ||
          data.alignement?.trim() ||
          data.projection?.trim() ||
          "Contenu vide";
        const titre = data.title || "...";
        const count = data.readCount || 0;

        const capsuleDiv = document.createElement("div");
        capsuleDiv.innerHTML = `
          <hr />
          <h3>${titre}</h3>
          <p style="color:lime">${contenu}</p>
          <p>👁️ <strong>Lectures :</strong> <span id="read-${doc.id}">${count}</span></p>
          <div class="comment-section">
            <textarea id="input-${doc.id}" placeholder="Ton commentaire..."></textarea>
            <button onclick="envoyerCommentaire('${doc.id}')">Envoyer</button>
            <div id="comments-${doc.id}" class="comments-list"></div>
          </div>
        `;
        container.appendChild(capsuleDiv);

        const key = "read_" + doc.id;
        if (!localStorage.getItem(key)) {
          db.collection("capsules").doc(doc.id).update({
            readCount: firebase.firestore.FieldValue.increment(1)
          }).then(() => {
            localStorage.setItem(key, "1");
            db.collection("capsules").doc(doc.id).get().then((updatedDoc) => {
              const updatedCount = updatedDoc.data().readCount || 0;
              const countSpan = document.getElementById("read-" + doc.id);
              if (countSpan) {
                countSpan.textContent = updatedCount;
              }
            });
          });
        }

        db.collection("capsules").doc(doc.id).collection("comments").orderBy("timestamp")
          .get().then(commentsSnap => {
            commentsSnap.forEach(comment => {
              const p = document.createElement("p");
              p.textContent = "💬 " + comment.data().texte;
              document.getElementById("comments-" + doc.id).appendChild(p);
            });
          });
      });
    });

  window.envoyerCommentaire = function (capsuleId) {
    const textarea = document.getElementById("input-" + capsuleId);
    const commentaire = textarea.value.trim();
    if (commentaire) {
      db.collection("capsules").doc(capsuleId).collection("comments").add({
        texte: commentaire,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        const p = document.createElement("p");
        p.textContent = "💬 " + commentaire;
        document.getElementById("comments-" + capsuleId).appendChild(p);
        textarea.value = "";
      });
    }
  };
});
