# NeuroLab — l'IA expliquée sans équations

Site de vulgarisation sur la data et l'intelligence artificielle, réalisé en **HTML5, CSS3 et JavaScript natif** (sans framework ni bibliothèque) dans le cadre du projet de programmation Web **TI504N** — EFREI Paris, 2026-2027.

## Équipe

| Membre | Rôle principal | Pages |
| --- | --- | --- |
| Yoann Lehong Cheffson | Charte CSS, JavaScript, intégration | Accueil, À propos, articles, tous les scripts, illustrations et vidéo |
| Loïc Chen | Pages de contenu | Comprendre, Applications (tableau comparatif) |
| Joseph Kenmogne | Page Labo | Structure HTML/CSS du Labo (démo et quiz) |

## Liens

- Site en ligne : https://yoannlcf.github.io/neurolab/
- Maquette Figma : https://www.figma.com/design/uELUCYvhMqvKLPQbX6wWLW (export PDF dans `maquette/`)

## Lancer le site

Le plus simple est la version en ligne ci-dessus.

En local, ouvrir le dossier dans VS Code et lancer `index.html` avec l'extension **Live Server**. Le quiz charge `data/quiz.json` avec `fetch()`, ce que les navigateurs bloquent quand on ouvre le fichier par un double-clic (`file://`) : dans ce cas, le quiz affiche un message d'erreur et le reste du site fonctionne normalement.

## Pages

| Niveau | Page | Contenu |
| --- | --- | --- |
| 0 | `index.html` | Accueil : présentation, thèmes, chiffres clés sourcés |
| 1 | `pages/comprendre.html` | Notions de base, sommaire collant / accordéon, schéma SVG |
| 2 | `pages/article-machine-learning.html` | Article sur le Machine Learning |
| 2 | `pages/article-reseaux-neurones.html` | Article sur les réseaux de neurones |
| 1 | `pages/applications.html` | Tableau comparatif filtrable par domaine |
| 1 | `pages/labo.html` | Démo k-means sur canvas, quiz chargé en JSON |
| 1 | `pages/a-propos.html` | Équipe, technologies, formulaire de contact validé en JS |

## JavaScript

| Fichier | Rôle |
| --- | --- |
| `js/main.js` | Menu burger (toutes les pages) |
| `js/carrousel.js` | Carrousel des thèmes : flèches, points, swipe, défilement automatique |
| `js/comprendre.js` | Sommaire replié sur mobile (`matchMedia`) |
| `js/applications.js` | Filtres du tableau comparatif |
| `js/contact.js` | Validation du formulaire en temps réel, envoi simulé |
| `js/kmeans.js` | Algorithme k-means animé dans un `<canvas>` |
| `js/quiz.js` | Quiz : `fetch` asynchrone de `data/quiz.json` dans un `try/catch`, meilleur score en `localStorage` |

Tous les scripts sont chargés avec `defer`.

## Structure

```
neurolab/
├── index.html
├── pages/       Pages de niveau 1 et 2 (+ modele.html, gabarit de page)
├── css/         style.css (commun) + une feuille par groupe de pages
├── js/          Scripts
├── data/        quiz.json
├── img/        Illustrations SVG originales, favicon, affiche de la vidéo
├── video/      Vidéo explicative (MP4) et sous-titres (VTT)
└── maquette/    Export PDF de la maquette Figma
```

## Méthode Git

Une branche par fonctionnalité, fusion dans `main` par Pull Request relue par un autre membre, validation W3C avant fusion.

## Sources des chiffres

- Dartmouth College — conférence de 1956 : https://home.dartmouth.edu/about/artificial-intelligence-ai-coined-dartmouth
- Insee Première n° 2120, juillet 2026 : https://www.insee.fr/fr/statistiques/fichier/version-html/9025878/IP2120.pdf
- IoT Analytics, State of IoT 2025 : https://iotbusinessnews.com/2025/10/30/state-of-iot-2025-number-of-connected-iot-devices-growing-14-to-21-1-billion-globally/
