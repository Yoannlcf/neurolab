/* =========================================================
   NeuroLab — quiz du labo
   Les questions sont chargées depuis data/quiz.json avec fetch().
   ========================================================= */

const QUIZ_URL = "../data/quiz.json";
const CLE_MEILLEUR_SCORE = "neurolab-meilleur-score";

// Éléments de la page (déjà présents dans labo.html)
const quizForm = document.getElementById("quiz");
const progressText = document.getElementById("quiz-progress-text");
const scoreText = document.getElementById("quiz-score");
const progressBar = document.getElementById("quiz-progress");
const questionText = document.getElementById("quiz-question");
const optionsBox = document.getElementById("quiz-options");
const feedback = document.getElementById("quiz-feedback");
const bouton = quizForm ? quizForm.querySelector("button[type='submit']") : null;

// État du quiz
let questions = [];
let index = 0;          // numéro de la question en cours (0 = première)
let score = 0;
let repondu = false;    // true quand la réponse à la question en cours est validée


/* ---------- Chargement asynchrone des questions ---------- */
async function chargerQuiz() {
  try {
    const reponse = await fetch(QUIZ_URL);

    // fetch ne lève pas d'erreur sur un 404 : on la déclenche nous-mêmes
    if (!reponse.ok) {
      throw new Error("Fichier introuvable (code " + reponse.status + ")");
    }

    questions = await reponse.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Le fichier ne contient aucune question");
    }

    afficherQuestion();
  } catch (erreur) {
    // En cas d'échec, on prévient l'utilisateur au lieu de laisser une page cassée.
    // Le reste de la page (démo k-means, menu…) continue de fonctionner.
    console.error("Quiz :", erreur);
    quizForm.innerHTML =
      '<p class="quiz__feedback quiz__feedback--ko">Impossible de charger le quiz pour le moment. ' +
      "Si vous avez ouvert le fichier directement, lancez le site avec un serveur local " +
      "(extension Live Server de VS Code) ou consultez la version en ligne.</p>";
  }
}


/* ---------- Affichage d'une question ---------- */
function afficherQuestion() {
  const q = questions[index];
  repondu = false;

  progressText.textContent = "Question " + (index + 1) + " / " + questions.length;
  scoreText.textContent = "Score : " + score;
  progressBar.max = questions.length;
  progressBar.value = index + 1;
  progressBar.textContent = (index + 1) + " sur " + questions.length;
  questionText.textContent = q.question;

  // On reconstruit les réponses : un <label> contenant un bouton radio par option
  optionsBox.innerHTML = "";
  q.options.forEach((texte, i) => {
    const label = document.createElement("label");
    label.className = "quiz__option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "reponse";
    radio.value = i;

    label.append(radio, " " + texte);   // textContent : aucun HTML injecté
    optionsBox.append(label);
  });

  afficherRetour("", "");
  bouton.textContent = "Valider ma réponse";
}


/* ---------- Message sous la question ---------- */
function afficherRetour(message, type) {
  feedback.textContent = message;
  feedback.className = "quiz__feedback" + (type ? " quiz__feedback--" + type : "");
}


/* ---------- Clic sur le bouton du formulaire ---------- */
function gererEnvoi(event) {
  event.preventDefault();               // empêche le rechargement de la page

  // 2e clic après une réponse : on passe à la suite
  if (repondu) {
    index++;
    if (index < questions.length) {
      afficherQuestion();
    } else {
      afficherFin();
    }
    return;
  }

  const choix = quizForm.querySelector("input[name='reponse']:checked");
  if (!choix) {
    afficherRetour("Choisissez une réponse avant de valider.", "ko");
    return;
  }

  const q = questions[index];
  const correct = Number(choix.value) === q.reponse;
  if (correct) {
    score++;
    afficherRetour("Bonne réponse ! " + q.explication, "ok");
  } else {
    afficherRetour("Raté. La bonne réponse était : « " + q.options[q.reponse] + " ». " + q.explication, "ko");
  }

  // On bloque les réponses pour éviter de changer d'avis après validation
  optionsBox.querySelectorAll("input").forEach((input) => { input.disabled = true; });
  scoreText.textContent = "Score : " + score;
  repondu = true;
  bouton.textContent = index < questions.length - 1 ? "Question suivante" : "Voir mon résultat";
}


/* ---------- Écran de fin ---------- */
function afficherFin() {
  const meilleur = Math.max(score, lireMeilleurScore());
  enregistrerMeilleurScore(meilleur);

  questionText.textContent = "Quiz terminé : " + score + " / " + questions.length;
  optionsBox.innerHTML = "";
  afficherRetour("Votre meilleur score sur cet appareil : " + meilleur + " / " + questions.length + ".", "ok");
  bouton.textContent = "Recommencer";

  // Le prochain clic relance le quiz depuis le début
  index = -1;
  score = 0;
  repondu = true;
}


/* ---------- Meilleur score (localStorage) ---------- */
// localStorage peut être bloqué (navigation privée) : on protège chaque accès
function lireMeilleurScore() {
  try {
    return Number(localStorage.getItem(CLE_MEILLEUR_SCORE)) || 0;
  } catch (erreur) {
    return 0;
  }
}

function enregistrerMeilleurScore(valeur) {
  try {
    localStorage.setItem(CLE_MEILLEUR_SCORE, valeur);
  } catch (erreur) {
    // pas d'enregistrement possible : le quiz fonctionne quand même
  }
}


/* ---------- Démarrage ---------- */
if (quizForm) {
  quizForm.addEventListener("submit", gererEnvoi);
  chargerQuiz();
}
