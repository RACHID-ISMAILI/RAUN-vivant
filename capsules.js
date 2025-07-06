
document.addEventListener("DOMContentLoaded", async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const container = document.getElementById("capsules");
  const snapshot = await db.collection("capsules").orderBy("timestamp", "desc").get();
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    const text = data.text || "Capsule vide";
    const up = data.votesUp || 0;
    const down = data.votesDown || 0;

    const div = document.createElement("div");
    div.className = "capsule";
    div.innerHTML = `
      <p>${text}</p>
      <p>
        <button onclick="vote('${id}', 'votesUp')">👍 <span id="up-${id}">${up}</span></button>
        <button onclick="vote('${id}', 'votesDown')">👎 <span id="down-${id}">${down}</span></button>
      </p>
    `;
    container.appendChild(div);
  });
});

function vote(id, type) {
  const key = "voted-" + id;
  if (localStorage.getItem(key)) {
    alert("Tu as déjà voté !");
    return;
  }
  const ref = firebase.firestore().collection("capsules").doc(id);
  ref.update({ [type]: firebase.firestore.FieldValue.increment(1) }).then(() => {
    localStorage.setItem(key, "1");
    const span = document.getElementById((type === "votesUp" ? "up-" : "down-") + id);
    span.textContent = parseInt(span.textContent) + 1;
  });
}
