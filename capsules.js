
// Exemple statique en attendant Firebase
document.addEventListener("DOMContentLoaded", () => {
  const capsules = [
    "🔥 La flamme ne s’éteint jamais chez celui qui est éveillé.",
    "🧬 Chaque souffle contient un secret.",
    "🌱 Ce que tu es ne peut être défait par l’ombre.",
    "💡 Le silence est le langage de l’Être.",
    "🌌 Je suis vivant, et c’est là ma seule vérité."
  ];

  const container = document.getElementById("capsules");
  capsules.forEach((text, index) => {
    const div = document.createElement("div");
    div.className = "capsule";
    div.style.animationDelay = `${index * 0.5}s`;
    div.textContent = text;
    container.appendChild(div);
  });
});
