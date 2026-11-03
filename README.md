# NeuroLab — l'IA expliquée sans équations

Site de vulgarisation sur la data et l'intelligence artificielle, réalisé en **HTML5, CSS3 et JavaScript natif** (sans framework ni bibliothèque) dans le cadre du projet de programmation Web **TI504N** — EFREI Paris, 2026-2027.

## Équipe

| Membre | Rôle principal | Pages |
| --- | --- | --- |
| Yoann Lehong Cheffson | Charte CSS, header/footer, responsive | Accueil, À propos + formulaire |
| Loïc Chen | Contenu, tableaux, médias | Comprendre, articles, Applications |
| Joseph Kenmogne | JavaScript | Labo (k-means + quiz), carrousel |

## Liens

- Maquette Figma : https://www.figma.com/design/uELUCYvhMqvKLPQbX6wWLW
- Site en ligne : _à compléter (GitHub Pages)_

## Structure du projet

```
neurolab/
├── index.html          Accueil (niveau 0)
├── pages/              Pages de niveau 1 et 2
├── css/                Feuilles de style
├── js/                 Scripts (chargés avec defer)
├── data/               Fichiers JSON (questions du quiz)
├── img/                Images
├── video/              Vidéos
└── maquette/           Export de la maquette (PDF / PNG)
```

## Lancer le site

Ouvrir `index.html` dans un navigateur. Le quiz charge `data/quiz.json` avec `fetch()` : pour le tester en local, utiliser l'extension **Live Server** de VS Code (un simple double-clic sur le fichier bloque `fetch`).

## Règles de travail Git

1. On ne code jamais directement sur `main`.
2. Une branche par fonctionnalité : `feature/header`, `feature/page-comprendre`, `feature/labo-kmeans`…
3. Des commits petits et explicites, en français, au présent :
   `Ajoute le tableau comparatif`, `Corrige le menu burger sur mobile`.
4. Avant de fusionner : valider la page avec le [validateur HTML W3C](https://validator.w3.org/) et le CSS avec le [validateur CSS W3C](https://jigsaw.w3.org/css-validator/).
5. Fusion dans `main` par Pull Request, relue par un autre membre.

## Validation W3C

| Page | HTML | CSS |
| --- | --- | --- |
| index.html | ⬜ | ⬜ |
| pages/comprendre.html | ⬜ | ⬜ |
| pages/article-machine-learning.html | ⬜ | ⬜ |
| pages/article-reseaux-neurones.html | ⬜ | ⬜ |
| pages/applications.html | ⬜ | ⬜ |
| pages/labo.html | ⬜ | ⬜ |
| pages/a-propos.html | ⬜ | ⬜ |

## Sources des chiffres

- Dartmouth College — conférence de 1956 : https://home.dartmouth.edu/about/artificial-intelligence-ai-coined-dartmouth
- Insee Première n° 2120, juillet 2026 : https://www.insee.fr/fr/statistiques/fichier/version-html/9025878/IP2120.pdf
- IoT Analytics, State of IoT 2025 : https://iotbusinessnews.com/2025/10/30/state-of-iot-2025-number-of-connected-iot-devices-growing-14-to-21-1-billion-globally/
