/* =========================================================
   NeuroLab — démonstration de l'algorithme k-means
   Dessinée dans un <canvas>, en JavaScript natif, sans bibliothèque.

   Principe de k-means :
   1. On place k « centres » au hasard parmi les points.
   2. Chaque point rejoint le centre le plus proche (affectation).
   3. Chaque centre se déplace au milieu de ses points (mise à jour).
   4. On répète 2 et 3 jusqu'à ce que plus rien ne bouge.
   ========================================================= */

const canvas = document.getElementById("kmeans-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const sliderK = document.getElementById("k");
const sliderPoints = document.getElementById("nb-points");
const sortieK = document.getElementById("k-value");
const sortiePoints = document.getElementById("nb-points-value");
const btnGenerer = document.getElementById("btn-generer");
const btnLancer = document.getElementById("btn-lancer");
const btnReset = document.getElementById("btn-reset");
const statut = document.getElementById("kmeans-status");

// Une couleur par groupe (6 groupes maximum, comme le curseur)
const COULEURS = ["#00CEC9", "#6C5CE7", "#FDCB6E", "#E17055", "#00B894", "#FD79A8"];
const MAX_ETAPES = 30;      // sécurité : on s'arrête même si ça ne converge pas
const DELAI = 700;          // millisecondes entre deux étapes de l'animation

let points = [];            // { x, y, groupe }
let centres = [];           // { x, y }
let minuterie = null;       // identifiant du setInterval en cours


/* ---------- Outils ---------- */
function hasard(min, max) {
  return min + Math.random() * (max - min);
}

// Nombre aléatoire « en cloche » (loi normale, méthode de Box-Muller) :
// les points se concentrent autour d'un centre, ce qui forme des nuages réalistes
function hasardNormal() {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function distance2(a, b) {
  // distance au carré : suffit pour comparer et évite une racine carrée
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}


/* ---------- Dessin ---------- */
function dessiner() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  points.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = p.groupe === null ? "#B8BCD0" : COULEURS[p.groupe];
    ctx.fill();
  });

  // Les centres : une croix épaisse, contour blanc pour rester visible
  centres.forEach((c, i) => {
    ctx.lineCap = "round";
    [["#FFFFFF", 9], [COULEURS[i], 5]].forEach(([couleur, epaisseur]) => {
      ctx.strokeStyle = couleur;
      ctx.lineWidth = epaisseur;
      ctx.beginPath();
      ctx.moveTo(c.x - 12, c.y - 12);
      ctx.lineTo(c.x + 12, c.y + 12);
      ctx.moveTo(c.x + 12, c.y - 12);
      ctx.lineTo(c.x - 12, c.y + 12);
      ctx.stroke();
    });
  });
}


/* ---------- Génération des points ---------- */
function genererPoints() {
  arreter();
  const k = Number(sliderK.value);
  const total = Number(sliderPoints.value);
  const marge = 70;

  // On crée k nuages autour de « vrais » centres cachés…
  const nuages = [];
  for (let i = 0; i < k; i++) {
    nuages.push({ x: hasard(marge, canvas.width - marge), y: hasard(marge, canvas.height - marge) });
  }

  // …et on y répartit les points. L'algorithme ne connaît pas ces nuages :
  // il doit les retrouver tout seul.
  points = [];
  for (let i = 0; i < total; i++) {
    const n = nuages[i % k];
    points.push({
      x: Math.min(canvas.width - 8, Math.max(8, n.x + hasardNormal() * 45)),
      y: Math.min(canvas.height - 8, Math.max(8, n.y + hasardNormal() * 45)),
      groupe: null
    });
  }

  centres = [];
  dessiner();
  statut.textContent = total + " points générés. Lancez l’algorithme pour trouver " + k + " groupes.";
  btnLancer.disabled = false;
}


/* ---------- Les deux étapes de l'algorithme ---------- */
// Étape « affectation » : renvoie true si au moins un point a changé de groupe
function affecter() {
  let changement = false;
  points.forEach((p) => {
    let meilleur = 0;
    centres.forEach((c, i) => {
      if (distance2(p, c) < distance2(p, centres[meilleur])) {
        meilleur = i;
      }
    });
    if (p.groupe !== meilleur) {
      p.groupe = meilleur;
      changement = true;
    }
  });
  return changement;
}

// Étape « mise à jour » : chaque centre va à la moyenne de ses points
function deplacerCentres() {
  centres.forEach((c, i) => {
    const membres = points.filter((p) => p.groupe === i);
    if (membres.length > 0) {
      c.x = membres.reduce((somme, p) => somme + p.x, 0) / membres.length;
      c.y = membres.reduce((somme, p) => somme + p.y, 0) / membres.length;
    }
  });
}


/* ---------- Lancement animé ---------- */
function lancer() {
  if (points.length === 0) {
    statut.textContent = "Générez d’abord des points.";
    return;
  }
  arreter();
  const k = Number(sliderK.value);

  // Initialisation : k points tirés au hasard deviennent les premiers centres
  const melange = [...points].sort(() => Math.random() - 0.5);
  centres = melange.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
  points.forEach((p) => { p.groupe = null; });

  let etape = 0;
  dessiner();
  statut.textContent = "Étape 0 · " + k + " centres placés au hasard.";
  btnLancer.disabled = true;

  // setInterval répète la fonction toutes les DELAI ms : on voit l'algorithme travailler
  minuterie = setInterval(() => {
    etape++;
    const changement = affecter();
    deplacerCentres();
    dessiner();

    if (!changement || etape >= MAX_ETAPES) {
      arreter();
      statut.textContent = "Terminé en " + etape + " étapes : les groupes ne bougent plus.";
      btnLancer.disabled = false;
    } else {
      statut.textContent = "Étape " + etape + " · les points rejoignent le centre le plus proche, puis les centres se déplacent.";
    }
  }, DELAI);
}

function arreter() {
  clearInterval(minuterie);
  minuterie = null;
}

function reinitialiser() {
  arreter();
  points = [];
  centres = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  statut.textContent = "Générez des points pour commencer.";
  btnLancer.disabled = false;
}


/* ---------- Écouteurs d'événements ---------- */
if (ctx) {
  // « input » se déclenche à chaque mouvement du curseur
  sliderK.addEventListener("input", () => { sortieK.textContent = sliderK.value; });
  sliderPoints.addEventListener("input", () => { sortiePoints.textContent = sliderPoints.value; });

  btnGenerer.addEventListener("click", genererPoints);
  btnLancer.addEventListener("click", lancer);
  btnReset.addEventListener("click", reinitialiser);

  genererPoints();   // la démo n'est pas vide à l'arrivée sur la page
}
