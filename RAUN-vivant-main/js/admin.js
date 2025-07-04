
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (email === "admin@raun.com" && password === "raun2025") {
    window.location.href = "secret.html";
  } else {
    alert("Accès refusé.");
  }
}
