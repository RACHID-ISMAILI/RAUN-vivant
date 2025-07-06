const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function renderCapsules() {
  db.collection("capsules").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    const container = document.getElementById("capsules");
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "capsule";
      div.innerHTML = `
        <h3>${data.title || "Sans titre"}</h3>
        <p>${data.text}</p>
        <p>👁 Lectures : ${data.readCount || 0}</p>
        <button onclick="vote('${doc.id}', 'up')">👍 ${data.votesUp || 0}</button>
        <button onclick="vote('${doc.id}', 'down')">👎 ${data.votesDown || 0}</button>
        <div style="margin-top: 10px">
          <textarea id="comment-${doc.id}" rows="2" placeholder="Laisser un commentaire..."></textarea><br>
          <button onclick="commenter('${doc.id}')">Commenter</button>
        </div>
      `;
      if (data.comments && data.comments.length > 0) {
        const commentBlock = document.createElement("div");
        commentBlock.innerHTML = "<h4>Commentaires :</h4>";
        data.comments.forEach(com => {
          const p = document.createElement("p");
          p.textContent = "- " + com;
          commentBlock.appendChild(p);
        });
        div.appendChild(commentBlock);
      }
      container.appendChild(div);
      db.collection("capsules").doc(doc.id).update({
        readCount: (data.readCount || 0) + 1
      }).catch(e => console.error("Erreur mise à jour readCount", e));
    });
  });
}

function vote(id, type) {
  const ref = db.collection("capsules").doc(id);
  db.runTransaction(tx => tx.get(ref).then(doc => {
    if (!doc.exists) return;
    const data = doc.data();
    const updates = (type === "up")
      ? { votesUp: (data.votesUp || 0) + 1 }
      : { votesDown: (data.votesDown || 0) + 1 };
    tx.update(ref, updates);
  }));
}

function commenter(id) {
  const txt = document.getElementById(`comment-${id}`).value.trim();
  if (!txt) return;
  const ref = db.collection("capsules").doc(id);
  ref.update({
    comments: firebase.firestore.FieldValue.arrayUnion(txt)
  }).then(() => {
    alert("Commentaire ajouté.");
    document.getElementById(`comment-${id}`).value = "";
  });
}

renderCapsules();
