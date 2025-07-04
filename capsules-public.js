
document.addEventListener("DOMContentLoaded", function () {
  const capsulesContainer = document.getElementById("capsules");

  function afficherCapsules() {
    firebase.firestore().collection("capsules").orderBy("timestamp", "desc").get()
      .then((querySnapshot) => {
        capsulesContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const titre = data.title || "...";
          const contenu = data.text?.trim() ||
                          data.content?.trim() ||
                          data.rappel?.trim() ||
                          data.alignement?.trim() ||
                          data.projection?.trim() ||
                          "Contenu vide";
          const count = data.readCount || 0;

          const capsule = document.createElement("div");
          capsule.innerHTML = `
            <hr />
            <h3>...</h3>
            <p><span style="color:lime">${contenu}</span></p>
            <p>👁️ <strong>Lectures</strong> : ${count}</p>
            <p>💬 <strong>Commentaires</strong> :</p>
            <input placeholder="Votre nom" class="nom" />
            <input placeholder="Votre commentaire" class="commentaire" />
            <button onclick="envoyerCommentaire('${doc.id}', this)">Envoyer</button>
            <div id="commentaires-${doc.id}"></div>
          `;
          capsulesContainer.appendChild(capsule);
        });
      });
  }

  afficherCapsules();
});
