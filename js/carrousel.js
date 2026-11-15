/* =========================================================
   NeuroLab — carrousel des thèmes (page d'accueil)
   La piste défile horizontalement en CSS (scroll-snap) : le doigt
   suffit sur mobile. Le JavaScript ajoute les flèches, les points
   et le défilement automatique toutes les 5 secondes.
   ========================================================= */

const carrousel = document.querySelector(".carousel");
const piste = document.querySelector(".carousel__track");
const btnPrecedent = document.querySelector(".carousel__arrow--prev");
const btnSuivant = document.querySelector(".carousel__arrow--next");
const zonePoints = document.querySelector(".carousel__dots");
const DELAI_AUTO = 5000;

let minuterieAuto = null;

/* ---------- Mesures ---------- */
// Distance d'une carte à la suivante (largeur de la carte + écart)
function pas() {
  const cartes = piste.children;
  return cartes.length > 1 ? cartes[1].offsetLeft - cartes[0].offsetLeft : piste.clientWidth;
}

// Nombre de positions possibles : 6 cartes, 3 visibles → 4 positions
function nbPositions() {
  const visibles = Math.max(1, Math.round(piste.clientWidth / pas()));
  return Math.max(1, piste.children.length - visibles + 1);
}

function positionActuelle() {
  return Math.round(piste.scrollLeft / pas());
}

/* ---------- Déplacement ---------- */
function allerA(position) {
  const total = nbPositions();
  // Après la dernière position on revient au début, et inversement
  const cible = (position + total) % total;
  piste.scrollTo({ left: cible * pas(), behavior: "smooth" });
}

/* ---------- Points de navigation ---------- */
function creerPoints() {
  zonePoints.innerHTML = "";
  for (let i = 0; i < nbPositions(); i++) {
    const point = document.createElement("button");
    point.type = "button";
    point.className = "carousel__dot";
    point.setAttribute("aria-label", "Aller à la position " + (i + 1));
    point.addEventListener("click", () => allerA(i));
    zonePoints.append(point);
  }
  majPoints();
}

function majPoints() {
  const actuelle = positionActuelle();
  Array.from(zonePoints.children).forEach((point, i) => {
    point.classList.toggle("carousel__dot--active", i === actuelle);
    point.setAttribute("aria-current", i === actuelle ? "true" : "false");
  });
}

/* ---------- Défilement automatique ---------- */
function demarrerAuto() {
  // On respecte le réglage « réduire les animations » du système
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  arreterAuto();
  minuterieAuto = setInterval(() => allerA(positionActuelle() + 1), DELAI_AUTO);
}

function arreterAuto() {
  clearInterval(minuterieAuto);
}

/* ---------- Démarrage ---------- */
if (carrousel && piste && zonePoints) {
  btnPrecedent.addEventListener("click", () => allerA(positionActuelle() - 1));
  btnSuivant.addEventListener("click", () => allerA(positionActuelle() + 1));

  // Le point actif suit le défilement, même au doigt
  piste.addEventListener("scroll", majPoints, { passive: true });

  // Le nombre de positions change avec la largeur de l'écran
  window.addEventListener("resize", creerPoints);

  // Pause quand la souris ou le clavier est sur le carrousel
  carrousel.addEventListener("mouseenter", arreterAuto);
  carrousel.addEventListener("mouseleave", demarrerAuto);
  carrousel.addEventListener("focusin", arreterAuto);
  carrousel.addEventListener("focusout", demarrerAuto);

  creerPoints();
  demarrerAuto();
}
