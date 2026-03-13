# Architecture Microservices E-commerce

## Vue d'ensemble

```
┌────────────────────────────────────────────────────┐
│                 API GATEWAY (Nginx)                   │
│              Port 80 - Routeur principal              │
└──────────────┬─────────────────┬───────────────────┘
                │                 │                 │
         ┌──────▼──────┐   ┌──────▼─────┐   ┌──────▼──────┐
         │  Products    │   │   Orders     │   │    Users    │
         │   Service    │   │   Service    │   │   Service   │
         │  Port 5002   │   │  Port 5003   │   │  Port 5001  │
         └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
                │                 │                 │
         ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼─────┐
         │ PostgreSQL   │   │ PostgreSQL   │   │ PostgreSQL   │
         │   Products   │   │   Orders     │   │    Users     │
         │  Port 5432   │   │  Port 5433   │   │  Port 5431   │
         └─────────────┘   └─────────────┘   └─────────────┘
```

## Services

### 1. **Products Service** (Port 5002)
- **Responsabilité** : Gestion des produits
- **Langage** : Node.js + Express + Sequelize
- **DB** : PostgreSQL (`products_db`)
- **Endpoints** : `/products`, `/health`

### 2. **Orders Service** (Port 5003)
- **Responsabilité** : Gestion des commandes
- **Langage** : Node.js + Express + Sequelize
- **DB** : PostgreSQL (`orders_db`)
- **Endpoints** : `/orders`, `/health`
- **Appels** : Products API, Users API

### 3. **Users Service** (Port 5001)
- **Responsabilité** : Gestion des utilisateurs
- **Langage** : Node.js + Express
- **DB** : PostgreSQL (`users_db`)
- **Endpoints** : `/users`, `/health`

## Réseau et Communication

- **Réseau Docker** : `ecommerce-network`
- **Communication interne** : noms des conteneurs (ex: `products-api:3000`)
- **Gateway** : Nginx route vers les services via proxy_pass

## Déploiement

```bash
docker compose up -d
```

**Tous les services démarrent en parallèle** avec healthchecks pour vérifier les dépendances.
