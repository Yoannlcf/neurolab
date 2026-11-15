/* =========================================================
   NeuroLab — validation du formulaire de contact (page À propos)
   Les erreurs s'affichent sous chaque champ, en temps réel.
   Pas de serveur : l'envoi est simulé par un message de confirmation.
   ========================================================= */

const form = document.getElementById("contact-form");

// Une règle par champ : une fonction qui renvoie un message d'erreur, ou "" si tout va bien
const REGLES = {
  nom: (valeur) => (valeur.trim().length < 2 ? "Indiquez votre nom (2 caractères minimum)." : ""),
  prenom: (valeur) => (valeur.trim().length < 2 ? "Indiquez votre prénom (2 caractères minimum)." : ""),
  // Expression régulière : du texte, un @, du texte, un point, du texte (ex. nom@domaine.fr)
  email: (valeur) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim()) ? "" : "Adresse e-mail invalide (ex. nom@domaine.fr)."),
  message: (valeur) => {
    const manque = 20 - valeur.trim().length;
    return manque > 0 ? "Votre message est trop court : encore " + manque + " caractère(s)." : "";
  },
  consentement: (valeur, champ) => (champ.checked ? "" : "Vous devez accepter pour envoyer le message.")
};


/* ---------- Affiche ou efface l'erreur d'un champ ---------- */
function afficherErreur(champ, message) {
  // Le conteneur est .form__field pour les champs texte, .form__check pour la case à cocher
  const conteneur = champ.closest(".form__field, .form__check");
  let zone = conteneur.querySelector(".form__error");

  if (message) {
    if (!zone) {
      zone = document.createElement("p");
      zone.className = "form__error";
      zone.id = champ.id + "-erreur";
      conteneur.append(zone);
    }
    zone.textContent = message;
    conteneur.classList.add("form__field--error");
    // Accessibilité : le lecteur d'écran annonce le champ comme invalide et lit l'erreur
    champ.setAttribute("aria-invalid", "true");
    champ.setAttribute("aria-describedby", zone.id);
  } else {
    if (zone) {
      zone.remove();
    }
    conteneur.classList.remove("form__field--error");
    champ.removeAttribute("aria-invalid");
    champ.removeAttribute("aria-describedby");
  }
}


/* ---------- Vérifie un champ, renvoie true s'il est valide ---------- */
function verifierChamp(champ) {
  const regle = REGLES[champ.name];
  if (!regle) {
    return true;            // champ sans règle (ex. le sujet, facultatif)
  }
  const message = regle(champ.value, champ);
  afficherErreur(champ, message);
  return message === "";
}


/* ---------- Envoi du formulaire ---------- */
function gererEnvoi(event) {
  event.preventDefault();    // pas de rechargement de page

  // On vérifie tous les champs, et on garde le premier en erreur
  let premiereErreur = null;
  Object.keys(REGLES).forEach((nom) => {
    const champ = form.elements[nom];
    if (!verifierChamp(champ) && !premiereErreur) {
      premiereErreur = champ;
    }
  });

  if (premiereErreur) {
    premiereErreur.focus();  // place le curseur sur le premier champ à corriger
    return;
  }

  // Tout est valide : on remplace le formulaire par un message de confirmation
  const prenom = form.elements.prenom.value.trim();
  const confirmation = document.createElement("div");
  confirmation.className = "form__success";
  confirmation.setAttribute("role", "status");
  confirmation.innerHTML = "<h3>Message envoyé !</h3><p></p>";
  confirmation.querySelector("p").textContent =
    "Merci " + prenom + ", nous vous répondrons sous 48 h. (Démonstration : aucun message n’est réellement envoyé.)";
  form.replaceWith(confirmation);
}


/* ---------- Démarrage ---------- */
if (form) {
  // novalidate : on remplace les bulles du navigateur par nos propres messages.
  // Sans JavaScript, la validation HTML (required, type="email") reste active.
  form.noValidate = true;
  form.addEventListener("submit", gererEnvoi);

  // Validation en temps réel :
  // - en quittant un champ (blur), on le vérifie ;
  // - en tapant (input), on revérifie seulement s'il était déjà en erreur,
  //   pour ne pas afficher d'erreur pendant que l'utilisateur commence à écrire.
  Array.from(form.elements).forEach((champ) => {
    if (!REGLES[champ.name]) {
      return;
    }
    champ.addEventListener("blur", () => verifierChamp(champ));
    champ.addEventListener("input", () => {
      if (champ.getAttribute("aria-invalid") === "true") {
        verifierChamp(champ);
      }
    });
    champ.addEventListener("change", () => {
      if (champ.type === "checkbox") {
        verifierChamp(champ);
      }
    });
  });
}
