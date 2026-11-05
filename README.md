# TP1 - Tickets de maintenance

Application Vue 3 permettant de consulter des tickets de maintenance depuis une API REST simulée avec JSON Server.

## Identité

- Nom : À compléter
- Prénom : À compléter

## Prérequis

- Node.js et npm installés
- Un navigateur récent

## Installation

```bash
npm install
```

## Lancement

Dans un premier terminal, lancer l'API JSON Server :

```bash
npx json-server db.json --port 3000
```

L'API est alors accessible à l'adresse [http://localhost:3000/tickets](http://localhost:3000/tickets).

Dans un second terminal, lancer l'application Vue :

```bash
npm run dev
```

Ouvrir ensuite l'adresse indiquée par Vite, généralement [http://localhost:5173](http://localhost:5173).

## Fonctionnalités réalisées

- Récupération des tickets avec Axios et `GET /tickets`
- Affichage du titre, de la description, du demandeur, de la priorité, du statut et de la date de chaque ticket
- Affichage de `Chargement…` pendant la requête
- Message d'erreur explicite si JSON Server est arrêté
- Recherche par titre
- Filtrage par statut et par priorité, y compris les deux filtres en même temps
- Compteur du nombre de tickets visibles
- Message si aucun ticket ne correspond aux filtres
- Badges visuels et accessibles pour les priorités et les statuts

## Captures demandées

Créer un dossier `captures/` et y ajouter les captures suivantes avant le rendu :

1. `capture-01-api.png` : réponse JSON de `GET /tickets`
2. `capture-02-trois-tickets.png` : application affichant les trois tickets
3. `capture-03-recherche.png` : résultat d'une recherche par titre
4. `capture-04-filtres.png` : filtrage combiné du statut et de la priorité
5. `capture-05-erreur.png` : message affiché lorsque JSON Server est arrêté

## Questions

### Quelle différence entre une API REST et le fichier `db.json` ?

`db.json` est un fichier local qui contient les données des tickets au format JSON. Ce n'est pas une base de données ni une API. JSON Server lit ce fichier et expose une API REST accessible avec des URL HTTP, comme `GET /tickets`. L'application Vue communique avec cette API plutôt qu'avec le fichier directement.

### Pourquoi utiliser `onMounted()` ?

`onMounted()` exécute une fonction lorsque le composant Vue est créé et affiché dans la page. Il permet de lancer le chargement des tickets dès l'ouverture de l'application.

### Quel est le rôle d'Axios ?

Axios est une bibliothèque JavaScript qui simplifie les requêtes HTTP. Ici, elle envoie la requête `GET` vers JSON Server et récupère la réponse JSON.

### Quelle différence entre `ref()` et `computed()` ?

`ref()` crée une donnée réactive qui peut être modifiée, comme la liste des tickets ou le texte de recherche. `computed()` crée une valeur calculée à partir de données réactives, comme la liste filtrée. Elle est recalculée automatiquement lorsque ses dépendances changent.

## Difficultés rencontrées

À compléter avec les difficultés rencontrées pendant l'installation de JSON Server, la connexion à l'API ou la mise en place des filtres.
