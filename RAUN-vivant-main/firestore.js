
const db = firebase.firestore();

function publierCapsule() {
  const text = document.getElementById("capsuleText").value;
  if (!text.trim()) {
    alert("Écris une capsule avant de publier.");
    return;
  }

  db.collection("capsules").add({
    texte: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Capsule publiée 🔥");
    document.getElementById("capsuleText").value = "";
  })
  .catch((error) => {
    alert("Erreur lors de la publication : " + error.message);
  });
}
