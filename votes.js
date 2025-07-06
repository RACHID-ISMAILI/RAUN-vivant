
async function updateVote(capsuleId, type) {
  const voted = JSON.parse(localStorage.getItem("voted_capsules")) || [];
  if (voted.includes(capsuleId)) {
    alert("Tu as déjà voté pour cette capsule.");
    return;
  }

  const capsuleRef = db.collection("capsules").doc(capsuleId);
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(capsuleRef);
    if (!doc.exists) return;
    const data = doc.data();
    const updates = {};
    updates[type] = (data[type] || 0) + 1;
    transaction.update(capsuleRef, updates);
  });

  voted.push(capsuleId);
  localStorage.setItem("voted_capsules", JSON.stringify(voted));
  loadCapsules(); // recharge
}

async function loadCapsules() {
  const container = document.getElementById("capsules");
  const snapshot = await db.collection("capsules").orderBy("timestamp", "desc").get();
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "capsule";
    const likes = data.likes || 0;
    const dislikes = data.dislikes || 0;
    div.innerHTML = `
      <div style="margin-bottom: 10px;">
        <p>${data.text}</p>
        <button onclick="updateVote('${doc.id}', 'likes')">👍 ${likes}</button>
        <button onclick="updateVote('${doc.id}', 'dislikes')">👎 ${dislikes}</button>
      </div>
      <hr style="border-color: lime;">
    `;
    container.appendChild(div);
  });
}
