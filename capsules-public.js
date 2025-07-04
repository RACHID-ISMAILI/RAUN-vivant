
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
          const contenu = data.text?.trim() ||
                          data.content?.trim() ||
                          data.rappel?.trim() ||
                          data.alignement?.trim() ||
                          data.projection?.trim() ||
                          "Contenu vide";
          const titre = data.title || "...";
          const count = data.readCount || 0;

          const capsule = document.createElement("div");
          capsule.innerHTML = `
            <hr />
            <h3>${titre}</h3>
            <p><span style="color:lime">${contenu}</span></p>
            <p>👁️ <strong>Lectures</strong> : <span id="read-${doc.id}">${count}</span></p>
          `;
          capsulesContainer.appendChild(capsule);

          // ✅ Incrémenter les lectures si pas déjà comptée
          const key = "read_" + doc.id;
          if (!localStorage.getItem(key)) {
            db.collection("capsules").doc(doc.id).update({
              readCount: firebase.firestore.FieldValue.increment(1)
            }).then(() => {
              localStorage.setItem(key, "1");
              const countSpan = document.getElementById("read-" + doc.id);
              if (countSpan) {
                countSpan.textContent = (data.readCount || 0) + 1;
              }
            }).catch((error) => {
              console.error("Erreur mise à jour compteur :", error);
            });
          }
        });
      }).catch((error) => {
        capsulesContainer.innerHTML = "<p style='color:red;'>Erreur de chargement des capsules : " + error.message + "</p>";
      });
  }

  afficherCapsules();
});
