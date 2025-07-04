
var firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network",
  storageBucket: "raun-network.firebasestorage.app",
  messagingSenderId: "541416001018",
  appId: "1:541416001018:web:ba7efef5aea63a30206843",
  measurementId: "G-FMMND6R3N9"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var auth = firebase.auth();

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "admin.html";
  }
});

function logout() {
  firebase.auth().signOut().then(function() {
    alert("Déconnecté avec succès");
    window.location.href = "index.html";
  });
}

function publishCapsule() {
  var text = document.getElementById("capsuleText").value;
  if (text.trim() === "") {
    alert("La capsule ne peut pas être vide.");
    return;
  }
  db.collection("capsules").add({
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function() {
    alert("Capsule publiée avec succès !");
    document.getElementById("capsuleText").value = "";
  }).catch(function(error) {
    alert("Erreur lors de la publication : " + error.message);
  });
}
