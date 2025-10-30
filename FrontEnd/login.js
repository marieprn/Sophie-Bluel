//Authentification
const emailCorrect = "sophie.bluel@test.tld";
const mdpCorrect = "S0phie";
const form = document.querySelector(".formLogIn");

if(form){
form.addEventListener("submit",(e) => {
    e.preventDefault();

    const email = form.elements["username"].value;
    const mdp = form.elements["password"].value;

    const ancienMsg = form.querySelector(".erreur");
    if (ancienMsg) ancienMsg.remove();

    if(email === emailCorrect && mdp === mdpCorrect){
        localStorage.setItem("connecte", "true");
        window.location.href = "index.html";
    }
    else{
        const msgErreur = document.createElement("p");
        msgErreur.textContent = "Erreur dans l'identifiant ou le mot de passe"
        form.appendChild(msgErreur);
        msgErreur.classList.add("erreur")
    }
});
}