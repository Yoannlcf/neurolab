/* =========================================================
   NeuroLab — filtres du tableau comparatif (page Applications)
   Chaque bouton et chaque ligne portent un attribut data-domaine :
   on affiche seulement les lignes du domaine choisi.
   ========================================================= */

const boutonsFiltre = document.querySelectorAll("[data-domaine].chip");
const lignes = document.querySelectorAll(".data-table tbody tr");
const compteur = document.getElementById("filtre-compteur");

function filtrer(domaine) {
  let visibles = 0;

  lignes.forEach((ligne) => {
    // dataset.domaine lit l'attribut data-domaine de la ligne
    const afficher = domaine === "tous" || ligne.dataset.domaine === domaine;
    ligne.classList.toggle("is-hidden", !afficher);   // ajoute ou retire la classe
    if (afficher) {
      visibles++;
    }
  });

  // Le bouton choisi devient actif, les autres non
  boutonsFiltre.forEach((bouton) => {
    const actif = bouton.dataset.domaine === domaine;
    bouton.classList.toggle("chip--active", actif);
    bouton.setAttribute("aria-pressed", actif);       // état lu par les lecteurs d'écran
  });

  compteur.textContent = visibles + (visibles > 1 ? " usages affichés" : " usage affiché") + " sur " + lignes.length + ".";
}

if (boutonsFiltre.length && compteur) {
  boutonsFiltre.forEach((bouton) => {
    bouton.addEventListener("click", () => filtrer(bouton.dataset.domaine));
  });
  filtrer("tous");
}
