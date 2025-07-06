
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
          const contenu =
            data.text?.trim() ||
            data.content?.trim() ||
            data.rappel?.trim() ||
            data.alignement?.trim() ||
            data.projection?.trim() ||
            "Contenu vide";
          const titre = data.title || "...";
          const count = data.readCount || 0;
          const votesUp = data.votesUp || 0;
          const votesDown = data.votesDown || 0;

          const capsule = document.createElement("div");
          capsule.innerHTML = `
            <hr />
            <h3>${titre}</h3>
            <p><span style="color:lime">${contenu}</span></p>
            <p>👁️ <strong>Lectures</strong> : <span id="read-${doc.id}">${count}</span></p>
            <p>
              <button onclick="voter('${doc.id}', 'votesUp')">👍 <span id="up-${doc.id}">${votesUp}</span></button>
              <button onclick="voter('${doc.id}', 'votesDown')">👎 <span id="down-${doc.id}">${votesDown}</span></button>
            </p>
          `;
          capsulesContainer.appendChild(capsule);

          const key = "read_" + doc.id;
          if (!localStorage.getItem(key)) {
            db.collection("capsules").doc(doc.id).update({
              readCount: firebase.firestore.FieldValue.increment(1)
            }).then(() => {
              localStorage.setItem(key, "1");
              db.collection("capsules").doc(doc.id).get().then((updatedDoc) => {
                const updatedCount = updatedDoc.data().readCount || 0;
                const countSpan = document.getElementById("read-" + doc.id);
                if (countSpan) countSpan.textContent = updatedCount;
              });
            }).catch((error) => {
              console.error("Erreur mise à jour compteur :", error);
            });
          }
        });
      })
      .catch((error) => {
        capsulesContainer.innerHTML =
          "<p style='color:red;'>Erreur de chargement des capsules : " + error.message + "</p>";
      });
  }

  window.voter = function (id, type) {
    const voteKey = "voted_" + id;
    if (localStorage.getItem(voteKey)) {
      alert("Tu as déjà voté !");
      return;
    }

    db.collection("capsules").doc(id).update({
      [type]: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
      localStorage.setItem(voteKey, "1");
      const spanId = type === "votesUp" ? "up-" + id : "down-" + id;
      const span = document.getElementById(spanId);
      if (span) span.textContent = parseInt(span.textContent) + 1;
    }).catch((error) => {
      console.error("Erreur de vote :", error);
    });
  };

  afficherCapsules();
});
