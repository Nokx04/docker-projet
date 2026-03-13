# E-Commerce Microservices

Architecture microservices complète avec Docker Compose. API Gateway, 3 services indépendants (Users, Products, Orders) et bases de données PostgreSQL.

## Architecture

```
API Gateway (Nginx)
├── Users Service  → PostgreSQL 14
├── Products Service → PostgreSQL 14
└── Orders Service → PostgreSQL 14
```

## Démarrage rapide

```bash
cd ecommerce
docker compose up -d
```

Tous les services seront accessibles via `http://localhost:8080`

Si jamais cela ne vous convient pas, rdv ligne 139 dans le compose.yaml pour le changer.

## Endpoints

### Users
- `GET /users` - Lister tous les utilisateurs
- `POST /users` - Créer un utilisateur
- `POST /users/login` - Authentifier un utilisateur

### Products
- `GET /products` - Lister tous les produits
- `GET /products/:id` - Récupérer un produit
- `POST /products` - Créer un produit
- `PUT /products/:id` - Modifier un produit

### Orders
- `GET /orders` - Lister toutes les commandes
- `GET /orders/:id` - Récupérer une commande
- `GET /orders/user/:user_id` - Commandes d'un utilisateur
- `POST /orders` - Créer une commande

## Technologies

- **Docker & Docker Compose** - Conteneurisation
- **Node.js + Express** - Services APIs
- **PostgreSQL** - Bases de données
- **Nginx** - API Gateway
- **Sequelize/pg** - ORM et drivers PostgreSQL

## Arrêt

```bash
docker compose down
```

Ou pour tout reset :
```bash
docker compose down -v
```

# Contributeurs

Ce projet a été réalisé par Raphaël Bedleem et Alexandre Vanneuville
Projet Docker ESGI2