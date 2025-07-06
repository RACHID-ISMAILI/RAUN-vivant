document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const container = document.getElementById("capsules");

  db.collection("capsules").orderBy("timestamp", "desc").get().then(snapshot => {
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const capsule = document.createElement("div");
      capsule.className = "capsule";
      capsule.innerHTML = `
        <p>${data.content || data.text || data.rappel || "..."}</p>
        <p>👁️ Lectures : ${data.readCount || 0}</p>
        <div class="votes">
          👍 <span>${data.votesUp || 0}</span>
          👎 <span>${data.votesDown || 0}</span>
        </div>
      `;
      container.appendChild(capsule);
    });
  });
});