
async function loadCapsules() {
  const res = await fetch("capsules.json");
  const capsules = await res.json();
  const container = document.getElementById("capsules");
  container.innerHTML = "";

  capsules.forEach(capsule => {
    let votesUp = localStorage.getItem(`voteUp-${capsule.id}`) || capsule.votesUp;
    let votesDown = localStorage.getItem(`voteDown-${capsule.id}`) || capsule.votesDown;
    let read = localStorage.getItem(`read-${capsule.id}`) || 0;
    let comments = JSON.parse(localStorage.getItem(`comments-${capsule.id}`) || "[]");

    // Marquer comme lu
    read++;
    localStorage.setItem(`read-${capsule.id}`, read);

    const div = document.createElement("div");
    div.className = "capsule";
    div.innerHTML = `
      <h3>${capsule.title}</h3>
      <p>${capsule.text}</p>
      <p>👁 Lectures : ${read}</p>
      <button onclick="vote('${capsule.id}', 'up')">👍 ${votesUp}</button>
      <button onclick="vote('${capsule.id}', 'down')">👎 ${votesDown}</button>
      <div style="margin-top: 10px">
        <textarea id="comment-${capsule.id}" rows="2" placeholder="Laisser un commentaire..."></textarea><br>
        <button onclick="addComment('${capsule.id}')">Commenter</button>
      </div>
    `;

    if (comments.length > 0) {
      const commentBlock = document.createElement("div");
      commentBlock.innerHTML = "<h4>Commentaires :</h4>";
      comments.forEach(com => {
        const p = document.createElement("p");
        p.textContent = "- " + com;
        commentBlock.appendChild(p);
      });
      div.appendChild(commentBlock);
    }

    container.appendChild(div);
  });
}

function vote(id, type) {
  const key = type === "up" ? `voteUp-${id}` : `voteDown-${id}`;
  let current = parseInt(localStorage.getItem(key) || "0");
  current++;
  localStorage.setItem(key, current);
  loadCapsules();
}

function addComment(id) {
  const textarea = document.getElementById(`comment-${id}`);
  const text = textarea.value.trim();
  if (!text) return;
  let comments = JSON.parse(localStorage.getItem(`comments-${id}`) || "[]");
  comments.push(text);
  localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
  textarea.value = "";
  loadCapsules();
}

window.onload = loadCapsules;
