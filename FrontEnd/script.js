const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");
let allWorks = [];
let figures = []; 

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

// --- Lancement ---
categoriesProjet();
projets();


