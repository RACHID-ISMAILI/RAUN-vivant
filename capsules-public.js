
const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function () {
  const capsulesContainer = document.getElementById("capsules-container");

  firebase.firestore().collection("capsules").orderBy("timestamp", "desc").get()
    .then((querySnapshot) => {
      capsulesContainer.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const contenu = data.texte?.trim() || "Contenu vide";

        const capsule = document.createElement("div");
        capsule.innerHTML = `
          <hr />
          <p><span style="color:lime">${contenu}</span></p>
        `;
        capsulesContainer.appendChild(capsule);
      });
    })
    .catch((error) => {
      capsulesContainer.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
    });
});
