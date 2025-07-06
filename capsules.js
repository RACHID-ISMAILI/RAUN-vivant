const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

let db;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  loadCapsulesFirestore();
} catch (e) {
  console.warn("Firebase failed, loading local capsules.json");
  loadCapsulesLocal();
}

function loadCapsulesFirestore() {
  db.collection("capsules").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    const container = document.getElementById("capsules");
    container.innerHTML = "";
    snapshot.forEach(doc => renderCapsule(doc.id, doc.data(), true));
  }, error => {
    console.warn("Firestore unavailable, switching to local.");
    loadCapsulesLocal();
  });
}

function loadCapsulesLocal() {
  fetch("capsules.json").then(res => res.json()).then(data => {
    const container = document.getElementById("capsules");
    container.innerHTML = "";
    data.forEach((capsule, index) => renderCapsule(index, capsule, false));
  });
}

function renderCapsule(id, data, online) {
  const container = document.getElementById("capsules");
  const div = document.createElement("div");
  div.className = "capsule";

  div.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.text}</p>
    <p>👁 Lectures : ${data.readCount}</p>
    <button onclick="vote('${id}', 'up', ${online})">👍 ${data.votesUp}</button>
    <button onclick="vote('${id}', 'down', ${online})">👎 ${data.votesDown}</button>
    <div><textarea id="comment-${id}" placeholder="Votre commentaire..."></textarea>
    <button onclick="commenter('${id}', ${online})">Commenter</button></div>
    ${data.comments && data.comments.length ? '<h4>Commentaires :</h4>' + data.comments.map(c => `<p>- ${c}</p>`).join("") : ''}
  `;
  container.appendChild(div);
}

function vote(id, type, online) {
  if (online) {
    const ref = db.collection("capsules").doc(id);
    db.runTransaction(tx => {
      return tx.get(ref).then(doc => {
        const data = doc.data();
        const count = (type === "up" ? (data.votesUp || 0) + 1 : (data.votesDown || 0) + 1);
        const update = type === "up" ? { votesUp: count } : { votesDown: count };
        tx.update(ref, update);
      });
    });
  } else {
    alert("Vote enregistré localement (mode hors ligne).");
  }
}

function commenter(id, online) {
  const val = document.getElementById(`comment-${id}`).value.trim();
  if (!val) return;
  if (online) {
    const ref = db.collection("capsules").doc(id);
    ref.update({
      comments: firebase.firestore.FieldValue.arrayUnion(val)
    }).then(() => {
      alert("Commentaire ajouté.");
      document.getElementById(`comment-${id}`).value = "";
    });
  } else {
    alert("Commentaire sauvegardé localement (hors ligne).");
  }
}
