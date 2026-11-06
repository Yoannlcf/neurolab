/* =========================================================
   NeuroLab — page Comprendre
   Sommaire déplié sur ordinateur, replié par défaut sur mobile.
   ========================================================= */

const tocDetails = document.querySelector(".toc__details");

// matchMedia teste une media query en JavaScript, comme en CSS
const mobile = window.matchMedia("(max-width: 768px)");

function adapterSommaire() {
  // .open est la propriété JavaScript de l'attribut open de <details>
  tocDetails.open = !mobile.matches;
}

if (tocDetails) {
  adapterSommaire();                               // au chargement de la page
  mobile.addEventListener("change", adapterSommaire); // si la fenêtre change de taille
}
