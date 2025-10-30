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

    boutonModifier.addEventListener("click", () => {
        modale.style.display = "flex";
    });

    iconeFermer.addEventListener("click", () => {
        modale.style.display = "none";
    });

    modale.addEventListener("click", (e) => {
        if (e.target === modale) modale.style.display = "none";
    });
}
