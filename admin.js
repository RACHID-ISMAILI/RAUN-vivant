
const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
  const zone = document.getElementById("adminZone");
  if (!user) {
    const email = prompt("Email :");
    const pass = prompt("Mot de passe :");
    auth.signInWithEmailAndPassword(email, pass).catch(err => {
      zone.innerHTML = "Erreur : " + err.message;
    });
  } else {
    zone.innerHTML = `
      <textarea id="capsule" rows="5" cols="60" placeholder="Écris ici..."></textarea><br>
      <button onclick="saveCapsule()">📤 Publier</button>
      <button onclick="logout()">🔓 Déconnexion</button>
    `;
  }
});

function saveCapsule() {
  const text = document.getElementById("capsule").value.trim();
  if (text === "") return;
  db.collection("capsules").add({
    text: text,
    timestamp: new Date(),
    votesUp: 0,
    votesDown: 0
  }).then(() => {
    alert("Capsule publiée !");
    document.getElementById("capsule").value = "";
  });
}

function logout() {
  firebase.auth().signOut().then(() => {
    location.reload();
  });
}
