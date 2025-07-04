
const firebaseConfig = {
  apiKey: "AIzaSyD0R0IFgjCk3gWgVxK3-WnfLubhAqsKbOM",
  authDomain: "raun-network.firebaseapp.com",
  projectId: "raun-network"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function publierCapsule() {
  const titre = document.getElementById("capsuleTitle").value.trim();
  const texte = document.getElementById("capsuleText").value.trim();

  if (!texte) {
    alert("Écris une capsule avant de publier.");
    return;
  }

  db.collection("capsules").add({
    title: titre || "...",
    content: texte,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Capsule publiée 🔥");
    document.getElementById("capsuleText").value = "";
    document.getElementById("capsuleTitle").value = "";
  }).catch(error => {
    alert("Erreur : " + error.message);
  });
}

function convertirTexte() {
  db.collection("capsules").get().then(snapshot => {
    const batch = db.batch();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.texte && (!data.content || !data.title)) {
        const docRef = db.collection("capsules").doc(doc.id);
        batch.update(docRef, {
          content: data.texte,
          title: "..."
        });
      }
    });
    return batch.commit();
  }).then(() => {
    alert("🎉 Mise à jour terminée !");
  }).catch(error => {
    alert("Erreur pendant la mise à jour : " + error.message);
  });
}

function corrigerCapsulesVides() {
  db.collection("capsules").get().then(snapshot => {
    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const docRef = db.collection("capsules").doc(doc.id);

      if ((!data.content || data.content.trim() === "") && data.texte && data.texte.trim() !== "") {
        batch.update(docRef, {
          content: data.texte,
          title: data.title || "..."
        });
        count++;
      }
    });

    if (count > 0) {
      return batch.commit().then(() => {
        alert(`✅ Capsules corrigées : ${count}`);
      });
    } else {
      alert("👍 Aucune capsule à corriger");
    }
  }).catch(error => {
    alert("❌ Erreur : " + error.message);
  });
}

function remplirContentDepuisChampsSpirituels() {
  db.collection("capsules").get().then(snapshot => {
    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const docRef = db.collection("capsules").doc(doc.id);

      if (!data.content || data.content.trim() === "" || data.content === "Contenu vide") {
        let nouveauContenu = "";

        if (data.rappel && data.rappel.trim() !== "") {
          nouveauContenu = data.rappel;
        } else if (data.alignement && data.alignement.trim() !== "") {
          nouveauContenu = data.alignement;
        } else if (data.projection && data.projection.trim() !== "") {
          nouveauContenu = data.projection;
        } else if (data.text && data.text.trim() !== "") {
          nouveauContenu = data.text;
        }

        if (nouveauContenu) {
          batch.update(docRef, {
            content: nouveauContenu,
            title: data.title || "..."
          });
          count++;
        }
      }
    });

    if (count > 0) {
      return batch.commit().then(() => {
        alert(`✅ ${count} capsules corrigées avec contenu spirituel`);
      });
    } else {
      alert("👍 Toutes les capsules sont déjà complètes !");
    }
  }).catch(error => {
    alert("❌ Erreur : " + error.message);
  });
}
