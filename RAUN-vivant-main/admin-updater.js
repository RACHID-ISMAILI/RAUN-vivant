
const updateOldCapsules = async () => {
  const db = firebase.firestore();
  const snapshot = await db.collection("capsules").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates = {};

    if (!data.content && data.texte) {
      updates.content = data.texte;
    }

    if (!data.title) {
      const rawText = data.texte || data.content || "";
      updates.title = rawText.split(" ").slice(0, 5).join(" ") + "...";
    }

    if (Object.keys(updates).length > 0) {
      await db.collection("capsules").doc(doc.id).update(updates);
      console.log(`✅ Capsule mise à jour : ${doc.id}`);
    }
  }

  alert("🎉 Mise à jour terminée !");
};
