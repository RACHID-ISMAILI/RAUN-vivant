
document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
    authDomain: "raun-network.firebaseapp.com",
    projectId: "raun-network",
    storageBucket: "raun-network.appspot.com",
    messagingSenderId: "541416001018",
    appId: "1:541416001018:web:ba7efef5aea63a30206843"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const container = document.getElementById("capsules");

  async function afficherCapsules() {
    const snapshot = await db.collection("capsules").orderBy("timestamp", "desc").get();
    container.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      const texte = data.text || "Contenu vide";
      const votesUp = data.votesUp || 0;
      const votesDown = data.votesDown || 0;

      const capsule = document.createElement("div");
      capsule.className = "capsule";
      capsule.innerHTML = `
        <h3 style="color:cyan;">Capsule 🔥</h3>
        <p style="color:lime;">${texte}</p>
        <p>
          <button onclick="vote('${id}', 'votesUp')">👍 <span id="up-${id}">${votesUp}</span></button>
          <button onclick="vote('${id}', 'votesDown')">👎 <span id="down-${id}">${votesDown}</span></button>
        </p>
        <textarea id="comment-${id}" placeholder="💬 Laisse ton commentaire ici..."></textarea>
        <button onclick="commenter('${id}')">Commenter</button>
        <div id="commentaires-${id}" class="commentaires"></div>
      `;
      container.appendChild(capsule);

      chargerCommentaires(id);
    });
  }

  function vote(id, type) {
    const key = "voted-" + id;
    if (localStorage.getItem(key)) {
      alert("Tu as déjà voté !");
      return;
    }
    db.collection("capsules").doc(id).update({
      [type]: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
      localStorage.setItem(key, "1");
      const span = document.getElementById((type === "votesUp" ? "up-" : "down-") + id);
      span.textContent = parseInt(span.textContent) + 1;
    });
  }

  function commenter(id) {
    const textarea = document.getElementById("comment-" + id);
    const message = textarea.value.trim();
    if (!message) return;
    db.collection("commentaires").add({
      capsuleId: id,
      message: message,
      timestamp: new Date()
    }).then(() => {
      textarea.value = "";
      chargerCommentaires(id);
    });
  }

  async function chargerCommentaires(id) {
    const container = document.getElementById("commentaires-" + id);
    const snapshot = await db.collection("commentaires")
      .where("capsuleId", "==", id)
      .orderBy("timestamp", "desc")
      .limit(5)
      .get();
    container.innerHTML = "<h4 style='color:#00ff00;'>Commentaires :</h4>";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.innerHTML = "💬 " + data.message;
      div.style.borderTop = "1px dashed #00ff00";
      div.style.marginTop = "5px";
      div.style.paddingTop = "5px";
      container.appendChild(div);
    });
  }

  afficherCapsules();
});
