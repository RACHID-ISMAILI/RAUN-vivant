const db = firebase.firestore();
const container = document.getElementById("capsules");

db.collection("capsules")
  .orderBy("timestamp", "desc")
  .onSnapshot((querySnapshot) => {
    container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const count = data.readCount || 0;
      const capsuleId = doc.id;

      const div = document.createElement("div");
      div.className = "capsule";
      div.innerHTML = `
        <p>${data.texte}</p>
        <p>👁️ <strong>Lectures</strong> : <span id="read-${capsuleId}">${count}</span></p>
      `;
      container.appendChild(div);

      // Protection localStorage
      const storageKey = "read_" + capsuleId;
      if (!localStorage.getItem(storageKey)) {
        db.collection("capsules").doc(capsuleId).update({
          readCount: firebase.firestore.FieldValue.increment(1)
        }).then(() => {
          localStorage.setItem(storageKey, "1");
          const countSpan = document.getElementById("read-" + capsuleId);
          if (countSpan) {
            countSpan.textContent = count + 1;
          }
        }).catch((error) => {
          console.error("Erreur mise à jour readCount :", error);
        });
      }
    });
  });
