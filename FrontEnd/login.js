//Authentification
const emailCorrect = "sophie.bluel@test.tld";
const mdpCorrect = "S0phie";
const form = document.querySelector(".formLogIn");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.elements["username"].value;
    const password = form.elements["password"].value;

    // On supprime un éventuel ancien message d'erreur
    const ancienMsg = form.querySelector(".erreur");
    if (ancienMsg) ancienMsg.remove();

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion réussie enregistre le token
        localStorage.setItem("token", data.token);
        localStorage.setItem("connecte", "true");

        window.location.href = "index.html";
      } else {
        const msgErreur = document.createElement("p");
        msgErreur.textContent = "Erreur dans l'identifiant ou le mot de passe";
        msgErreur.classList.add("erreur");
        form.appendChild(msgErreur);
      }
    } catch (error) {
      console.error("Erreur de connexion à l'API :", error);
      const msgErreur = document.createElement("p");
      msgErreur.textContent = "Impossible de se connecter au serveur.";
      form.appendChild(msgErreur);
    }
  });
}