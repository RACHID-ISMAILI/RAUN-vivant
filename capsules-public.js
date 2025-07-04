
document.addEventListener("DOMContentLoaded", function () {
  const capsulesContainer = document.getElementById("capsules");

  function afficherCapsules() {
    firebase.firestore().collection("capsules").orderBy("timestamp", "desc").get()
      .then((querySnapshot) => {
        capsulesContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const contenu = data.text?.trim() || "Contenu vide";

          const capsule = document.createElement("div");
          capsule.innerHTML = `
            <hr />
            <p><span style="color:lime">${contenu}</span></p>
          `;
          capsulesContainer.appendChild(capsule);
        });
      });
  }

  afficherCapsules();
});
