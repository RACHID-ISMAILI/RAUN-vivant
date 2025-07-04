
const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function publierCapsule() {
  const text = document.getElementById("capsuleText").value.trim();

  if (!text) {
    alert("Écris une capsule avant de publier.");
    return;
  }

  const title = text.split(" ").slice(0, 5).join(" ") + "...";

  db.collection("capsules").add({
    title: title,
    content: text,
    readCount: 0,
    comments: [],
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
