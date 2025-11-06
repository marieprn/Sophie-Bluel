const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");
let allWorks = [];
let figures = []; 

document.getElementById('login').addEventListener('click', () => {
  window.location.href = 'login.html';
});

//Chargement des catégories
async function categoriesProjet() {
    const categorie = await fetch("http://localhost:5678/api/categories");
    const responseCategorie = await categorie.json();

    responseCategorie.unshift({ id: 0, name: "Tous" });

    const categories = document.createElement("div");
    categories.classList.add("filters");

    for (let i = 0; i < responseCategorie.length; i++) {
        const cat = responseCategorie[i];

        const bntCategories = document.createElement("div");
        bntCategories.classList.add("filter-name");

        const p = document.createElement("p");
        p.textContent = cat.name;
        bntCategories.appendChild(p);

// Clic sur un filtre
        bntCategories.addEventListener("click", function () {
            // Enlever la classe active
            const allButtons = document.querySelectorAll(".filter-name");
            for (let j = 0; j < allButtons.length; j++) {
                allButtons[j].classList.remove("active");
            }
            bntCategories.classList.add("active");

// Masquer/Afficher en fonction de la catégorie 
            for (let k = 0; k < figures.length; k++) {
                const figure = figures[k];
                const work = allWorks[k];

                if (cat.id === 0 || work.categoryId === cat.id) {
                    figure.style.display = ""; 
                } else {
                    figure.style.display = "none"; 
                }
            }
        });

        categories.appendChild(bntCategories);
        portfolio.insertBefore(categories, gallery);
    }

    //appel mode édition
    const connexion = localStorage.getItem("connecte");
    if(connexion === "true"){
        activeModeEdition();
    }
}

//Chargement des projets
async function projets() {
    const works = await fetch("http://localhost:5678/api/works");
    const response = await works.json();
    allWorks = response;

    for (let i = 0; i < response.length; i++) {
        const work = response[i];
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
        figures.push(figure);
    }
}

categoriesProjet();
projets();

//Mode édition déclaration
function activeModeEdition() {
    const bandeau = document.createElement("div");
    bandeau.classList.add("bandeauEdition");

    const icone = document.createElement("img");
    icone.src = "assets/icons/edition.png";
    icone.alt = "Icone mode édition";
    icone.classList.add("iconeEdition");

    const texteEdition = document.createElement("span");
    texteEdition.textContent = "Mode édition";
    texteEdition.classList.add("texteEdition")

    bandeau.appendChild(icone);
    bandeau.appendChild(texteEdition);
    document.body.prepend(bandeau);

    const navItems = document.querySelectorAll("nav li");
    let loginLi = null;

    for (let z = 0; z < navItems.length; z++) {
        if (navItems[z].textContent.trim().toLowerCase() === "login") {
            loginLi = navItems[z];
            break;
        }
    }

    if (loginLi) {
        loginLi.textContent = "logout";
        loginLi.addEventListener("click", () => {
            localStorage.removeItem("connecte");
            window.location.reload();
        });
    }

    const filtres = document.querySelector(".filters");
    if (filtres){
        filtres.style.display = "none";
    }
    
    const headerPortfolio = document.querySelector(".headerPortfolio");

    const bntEdition = document.createElement("div");
    bntEdition.classList.add("bntEdition");

    const iconebnt = document.createElement("img");
    iconebnt.src = ("assets/icons/editionBlack.svg");
    iconebnt.classList.add("iconebnt");

    const boutonModifier = document.createElement("button");
    boutonModifier.textContent = "modifier";
    boutonModifier.classList.add("bnt-modifier");

    headerPortfolio.appendChild(bntEdition);
    bntEdition.prepend(iconebnt);
    bntEdition.appendChild(boutonModifier);
    
    //Modale
    const modale = document.querySelector(".arrierePlanModale");
    const iconeFermer = document.querySelector(".iconeFermer");
    const vueGalerie = document.querySelector(".modaleGalerie");
    const vueFormulaire = document.querySelector(".formulaire");
    const modificationGalerie = document.querySelector(".modificationgalerie");
    const btnAjouterPhoto = document.querySelector(".bntAjoutPhoto");
    const btnRetour = document.querySelector(".formulaire img");
    const formAjout = document.getElementById("formAjout");
    const selectCategorie = formAjout.querySelector("select[name='categoryId']");

    //ouvrir
    boutonModifier.addEventListener("click", () => {
        modale.style.display = "flex";
        vueGalerie.style.display = "block";
        vueFormulaire.style.display = "none";
        remplirGalerieModale();
    });

    //fermer
    iconeFermer.addEventListener("click", () => modale.style.display = "none");
    modale.addEventListener("click", e => { if(e.target === modale) modale.style.display = "none"; });

    //allez au formulaire 
      btnAjouterPhoto.addEventListener("click", () => {
        vueGalerie.style.display = "none";
        vueFormulaire.style.display = "block";
    });

    //sortir du formulaire 
     btnRetour.addEventListener("click", () => {
        vueFormulaire.style.display = "none";
        vueGalerie.style.display = "block";
    });

    //affichez projet dans la modale
     function remplirGalerieModale() {
        modificationGalerie.innerHTML = "";
        allWorks.forEach(work => {
            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const btnSupprimer = document.createElement("img");
            btnSupprimer.src = "assets/icons/poubelle.svg";
            btnSupprimer.classList.add("poubelle")
            btnSupprimer.addEventListener("click", async () => {
                const confirmation = confirm("Vous êtes sûr de vouloir supprimer ce projet ?");
                
                if (!confirmation) return;
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Vous devez être connecté pour supprimer un projet !");
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                    });

                    if (response.ok) {
                    //Supprimer dans la modale
                    figure.remove();

                    //Supprimer dans le tableau
                    allWorks = allWorks.filter(w => w.id !== work.id);

                    //Supprimer dans la galerie principale
                    const galleryFigures = document.querySelectorAll(".gallery figure");
                    galleryFigures.forEach(fig => {
                        const img = fig.querySelector("img");
                        if (img && img.src === work.imageUrl) {
                        fig.remove();
                        }
                    });

                    } else {
                    console.error("Erreur lors de la suppression :", response.status);
                    alert("La suppression a échoué.");
                    }
                } catch (error) {
                    console.error("Erreur réseau :", error);
                    alert("Impossible de contacter le serveur.");
                }
                });

            figure.appendChild(img);
            figure.appendChild(btnSupprimer);
            modificationGalerie.appendChild(figure);
        });
     }
     async function chargerCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        selectCategorie.innerHTML = "";
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            selectCategorie.appendChild(option);
        });
    }
    chargerCategories();

    // Soumission du formulaire
    formAjout.addEventListener("submit", e => {
        e.preventDefault();
        const nouveauTravail = {
            title: formAjout.title.value,
            imageUrl: formAjout.imageUrl.value,
            categoryId: parseInt(formAjout.categoryId.value),
        };
        allWorks.push(nouveauTravail);
        remplirGalerieModale();
        vueFormulaire.style.display = "none";
        vueGalerie.style.display = "block";
        formAjout.reset();
    });

    //ajout projet
    const formAdd = document.querySelector("#formAjout");
    const inputImage = document.querySelector("#image");
    const previewImage = document.querySelector("#preview");
    const inputTitle = formAdd.querySelector("input[name='title']");
    const selectCategory = formAdd.querySelector("select[name='categoryId']");
    const btnValider = document.querySelector("#btnValider");
    const zoneUpload = document.querySelector(".zoneUpload");

    //visualisation img
    inputImage.addEventListener("change", () => {
    const file = inputImage.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        btnValider.disabled = false;
        zoneUpload.classList.add("has-preview");
    };
    reader.readAsDataURL(file);
    });

    //appel catégorie
    async function chargerCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        selectCategory.innerHTML = "";
        categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        selectCategory.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
    }
    chargerCategories();

    //maj galerie
    function afficherGaleriePrincipale() {
    gallery.innerHTML = "";
    allWorks.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
    }

    //formualaire
    formAdd.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vous devez être connecté pour ajouter un projet !");
        return;
    }

    const image = inputImage.files[0];
    const title = inputTitle.value.trim();
    const category = selectCategory.value;

    if (!image || !title || !category) {
        alert("Merci de remplir tous les champs !");
        return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
        });

        if (response.ok) {
        const newWork = await response.json();

        allWorks.push(newWork);
        afficherGaleriePrincipale();
        remplirGalerieModale();

        //remettre à 0 le formulaire
        formAdd.reset();
        previewImage.style.display = "none";
        btnValider.disabled = true;
        zoneUpload.classList.remove("has-preview");
        modale.style.display = "none";

        } else {
        alert("Erreur lors de l'ajout du projet !");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible de contacter le serveur.");
    }
    });
    
}
