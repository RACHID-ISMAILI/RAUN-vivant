
function publishCapsule() {
  var text = document.getElementById("capsuleText").value;
  if (text.trim() === "") {
    alert("La capsule ne peut pas être vide.");
    return;
  }

  var title = text.split(" ").slice(0, 5).join(" ") + "...";

  db.collection("capsules").add({
    title: title,
    content: text,
    readCount: 0,
    comments: [],
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    alert("Capsule publiée 🔥");
    document.getElementById("capsuleText").value = "";
  }).catch(function (error) {
    alert("Erreur lors de la publication : " + error.message);
  });
}
