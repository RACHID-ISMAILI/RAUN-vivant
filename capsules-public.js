
document.addEventListener("DOMContentLoaded", function () {
  const capsulesContainer = document.getElementById("capsulesContainer");

  firebase.initializeApp({
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network"
  });

  const db = firebase.firestore();

  function afficherCapsules() {
    db.collection("capsules").orderBy("timestamp", "desc").get().then(snapshot => {
      let html = "";

      snapshot.forEach(doc => {
        const capsule = doc.data();
        const id = doc.id;

        const titre = capsule.title || "...";
        const contenu = capsule.text || capsule.content || capsule.rappel || capsule.alignement || capsule.projection || "Contenu vide";
        const readCount = capsule.readCount || 0;

        html += `
          <div class="capsule">
            <h3>...</h3>
            <p><strong>${titre}</strong></p>
            <p>${contenu}</p>
            <p>👁️ <strong>Lectures</strong> : ${readCount}</p>
            <p>💬 <strong>Commentaires</strong> :</p>
            <div id="comments-${id}"></div>
            <input type="text" placeholder="Votre nom" id="name-${id}" />
            <input type="text" placeholder="Votre commentaire" id="comment-${id}" />
            <button onclick="envoyerCommentaire('${id}')">Envoyer</button>
            <hr />
          </div>
        `;
      });

      capsulesContainer.innerHTML = html;
    });
  }

  afficherCapsules();
});
