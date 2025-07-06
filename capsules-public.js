
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
          const up = data.votesUp || 0;
          const down = data.votesDown || 0;

          const capsule = document.createElement("div");
          capsule.innerHTML = `
            <hr />
            <h3>${titre}</h3>
            <p><span style="color:lime">${contenu}</span></p>
            <p>👁️ <strong>Lectures</strong> : <span id="read-${doc.id}">${count}</span></p>
            <p>
              <button onclick="voteCapsule('${doc.id}', 'votesUp')">👍 <span id="up-${doc.id}">${up}</span></button>
              <button onclick="voteCapsule('${doc.id}', 'votesDown')">👎 <span id="down-${doc.id}">${down}</span></button>
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
            });
          }
        });
      })
      .catch((error) => {
        capsulesContainer.innerHTML =
          "<p style='color:red;'>Erreur de chargement des capsules : " + error.message + "</p>";
      });
  }

  window.voteCapsule = function(id, type) {
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
      if (span) span.textContent = parseInt(span.textContent) + 1;
    });
  };

  afficherCapsules();
});
