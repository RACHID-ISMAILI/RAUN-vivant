
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.href = "secret.html";
  }
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      alert("Erreur de connexion : " + error.message);
    });
}
