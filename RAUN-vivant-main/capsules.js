
const db = firebase.firestore();
const container = document.getElementById("capsules");

db.collection("capsules")
  .orderBy("timestamp", "desc")
  .onSnapshot((querySnapshot) => {
    container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "capsule";
      div.textContent = data.texte;
      container.appendChild(div);
    });
  });
