
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

function displayCapsules() {
  var container = document.getElementById("capsulesContainer");
  container.innerHTML = "Chargement des capsules...";
  db.collection("capsules").orderBy("timestamp", "desc").onSnapshot(function(snapshot) {
    container.innerHTML = "";
    snapshot.forEach(function(doc) {
      var div = document.createElement("div");
      div.className = "capsule";
      div.textContent = doc.data().text;
      container.appendChild(div);
    });
  });
}

displayCapsules();
