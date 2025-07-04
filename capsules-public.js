const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("capsules-container");

  db.collection("capsules").orderBy("timestamp", "desc").get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = "<p>Aucune capsule disponible pour le moment.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const titre = data.title || "...";
        const contenu = data.content?.trim() ||
                        data.texte?.trim() ||
                        data.rappel?.trim() ||
                        data.alignement?.trim() ||
                        data.projection?.trim() ||
                        "Contenu vide";
        const count = data.readCount || 0;

        const capsule = document.createElement("div");
        capsule.innerHTML = `
          <hr>
          <h3>${titre}</h3>
          <p><span style="color:lime">${contenu}</span></p>
          <p>👁️ Lectures : ${count}</p>
        `;
        container.appendChild(capsule);

        db.collection("capsules").doc(doc.id).update({
          readCount: count + 1
        });
      });
    })
    .catch(error => {
      container.innerHTML = `<p style="color:red;">Erreur de chargement : ${error.message}</p>`;
    });
});
