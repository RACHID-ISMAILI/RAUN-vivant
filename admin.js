
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

firebase.auth().onAuthStateChanged(function(user) {
  console.log("Auth state changed, user:", user);
  if (user) {
    if (!window.location.href.includes("secret.html")) {
      console.log("User connecté, redirection vers secret.html");
      window.location.href = "secret.html";
    } else {
      console.log("Déjà sur secret.html, pas de redirection");
    }
  } else {
    if (window.location.href.includes("secret.html")) {
      console.log("User non connecté sur secret.html, redirection vers admin.html");
      window.location.href = "admin.html";
    }
  }
});

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      alert("Erreur de connexion : " + error.message);
    });
}

function logout() {
  firebase.auth().signOut().then(function() {
    alert("Déconnecté avec succès");
    window.location.href = "index.html";
  }).catch(function(error) {
    alert("Erreur lors de la déconnexion : " + error.message);
  });
}
