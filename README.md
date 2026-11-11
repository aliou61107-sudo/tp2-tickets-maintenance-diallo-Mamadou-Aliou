# TP2 - Tickets de maintenance

Application Vue 3 permettant de consulter et gérer des tickets de maintenance depuis une API REST simulée avec JSON Server.

## Identité

- Nom : DIALLO
- Prénom : MAMADOU ALIOU
- Classe : L2DSI1

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
- Création, modification et suppression des tickets avec persistance dans JSON Server
- Navigation avec Vue Router entre la liste, la création et le détail d'un ticket
- Changement rapide du statut d'un ticket
- Validation des champs obligatoires et protection contre les doubles clics
- Gestion des tickets inexistants et des erreurs réseau

## Captures demandées

Créer un dossier `captures/` et y ajouter les captures suivantes avant le rendu :

1. `capture-01-creation.png` : formulaire de création renseigné
2. `capture-02-ticket-cree.png` : ticket nouvellement créé dans la liste
3. `capture-03-modification.png` : formulaire de modification et statut mis à jour
4. `capture-04-detail.png` : page de détail d'un ticket
5. `capture-05-confirmation-suppression.png` : dialogue de confirmation de suppression
6. `capture-06-validation.png` : message de validation d'un champ obligatoire
7. `capture-07-erreur.png` : message d'erreur réseau ou ticket inexistant

## Questions

### Différence entre POST, PUT et PATCH

`POST` crée une nouvelle ressource. `PUT` remplace généralement une ressource complète. `PATCH` modifie seulement certains champs d'une ressource existante. Dans ce projet, `POST` est utilisé pour créer un ticket et `PATCH` pour modifier les champs changés.

### Pourquoi une confirmation avant DELETE ?

Une suppression avec `DELETE` est une action difficile à annuler. La confirmation évite de supprimer un ticket par erreur et laisse à l'utilisateur la possibilité d'annuler.

### Quel est le rôle de Vue Router ?

Vue Router associe une URL à un composant Vue. Il permet de naviguer entre la liste (`/tickets`), le formulaire de création (`/tickets/nouveau`) et le détail d'un ticket (`/tickets/:id`) sans recharger toute la page.

### Comment éviter les doublons lors de l'enregistrement ?

Le bouton d'enregistrement est désactivé grâce à une variable réactive pendant la requête réseau. Ainsi, l'utilisateur ne peut pas envoyer plusieurs fois le même formulaire en cliquant rapidement.

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
