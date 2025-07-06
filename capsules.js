
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

async function updateVote(capsuleId, type) {
  const voted = JSON.parse(localStorage.getItem("voted_capsules")) || [];
  if (voted.includes(capsuleId)) {
    alert("Tu as déjà voté pour cette capsule.");
    return;
  }

  const capsuleRef = db.collection("capsules").doc(capsuleId);
  await capsuleRef.update({
    [type]: firebase.firestore.FieldValue.increment(1)
  });

  voted.push(capsuleId);
  localStorage.setItem("voted_capsules", JSON.stringify(voted));
  loadCapsules();
}

async function loadCapsules() {
  const container = document.getElementById("capsules");
  const snapshot = await db.collection("capsules").orderBy("timestamp", "desc").get();
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    const viewsKey = 'views-' + id;
    let views = parseInt(localStorage.getItem(viewsKey) || "0") + 1;
    localStorage.setItem(viewsKey, views);
    const likes = data.likes || 0;
    const dislikes = data.dislikes || 0;

    const capsuleDiv = document.createElement("div");
    capsuleDiv.className = "capsule";
    capsuleDiv.innerHTML = `
      <p>${data.text}</p>
      <p>👁️ Lectures : ${views}</p>
      <p>
        <button onclick="updateVote('${id}', 'likes')">👍 ${likes}</button>
        <button onclick="updateVote('${id}', 'dislikes')">👎 ${dislikes}</button>
      </p>
      <div class="comments" id="comments-${id}"></div>
      <textarea id="input-${id}" placeholder="Écris un commentaire..."></textarea>
      <button onclick="addComment('${id}')">Commenter</button>
    `;
    container.appendChild(capsuleDiv);
    showComments(id);
  });
}

function addComment(id) {
  const input = document.getElementById('input-' + id);
  const text = input.value.trim();
  if (text === "") return;
  const key = 'comments-' + id;
  let comments = JSON.parse(localStorage.getItem(key)) || [];
  comments.push(text);
  localStorage.setItem(key, JSON.stringify(comments));
  input.value = "";
  showComments(id);
}

function showComments(id) {
  const key = 'comments-' + id;
  const container = document.getElementById('comments-' + id);
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  container.innerHTML = comments.map(c => '<div class="comment">💬 ' + c + '</div>').join('');
}

window.onload = loadCapsules;
