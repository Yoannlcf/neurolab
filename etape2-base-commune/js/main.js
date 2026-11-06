/* =========================================================
   NeuroLab — script commun à toutes les pages
   Chargé avec l'attribut defer : il s'exécute une fois le HTML
   lu, sans bloquer l'affichage de la page.
   ========================================================= */

/* ---------- Menu burger (mobile) ---------- */
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");

// Si une page n'a pas de menu, le script ne plante pas
if (nav && toggle) {
  toggle.addEventListener("click", () => {
    // toggle() ajoute la classe si elle est absente, la retire sinon,
    // et renvoie true si le menu est maintenant ouvert
    const isOpen = nav.classList.toggle("nav--open");

    // Informe les lecteurs d'écran de l'état du menu
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });
}
