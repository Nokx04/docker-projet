# API Documentation

## Base URL

- **Local** : `http://localhost` (Gateway)
- **Direct** :
  - Products: `http://localhost:5002`
  - Orders: `http://localhost:5003`
  - Users: `http://localhost:5001`

---

## Products API (`/products`)

### GET `/products`
Récupère tous les produits
```bash
curl http://localhost/products
```
**Response (200)**
```json
[
  {
    "id": 1,
    "name": "Laptop Dell XPS",
    "price": "999.99",
    "stock": 5,
    "created_at": "2026-03-13T14:56:46.798Z"
  }
]
```

### GET `/products/:id`
Récupère un produit par ID
```bash
curl http://localhost/products/1
```

### POST `/products`
Crée un nouveau produit
```bash
curl -X POST http://localhost/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse", "price": 25.99, "stock": 100}'
```

### PUT `/products/:id`
Met à jour un produit

### DELETE `/products/:id`
Supprime un produit

### POST `/products/:id/decrement-stock`
Décrémente le stock (appelé par Orders)
```json
{"quantity": 2}
```

---

## Orders API (`/orders`)

### GET `/orders`
Récupère toutes les commandes
```bash
curl http://localhost/orders
```
**Response (200)**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "quantity": 2,
    "total_price": "1999.98",
    "status": "confirmed",
    "created_at": "2026-03-13T15:32:12.890Z"
  }
]
```

### GET `/orders/:id`
Récupère une commande par ID

### GET `/orders/user/:user_id`
Récupère les commandes d'un user

### POST `/orders`
Crée une nouvelle commande
```bash
curl -X POST http://localhost/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "product_id": 1,
    "quantity": 2
  }'
```
- ✅ Vérifie le stock
- ✅ Décrémente le stock automatiquement
- ✅ Calcule le prix total

---

## Users API (`/users`)

### GET `/users`
Récupère tous les user
```bash
curl http://localhost/users
```
**Response (200)**
```json
[]
```

### POST `/users`
Crée un nouvel user
```bash
curl -X POST http://localhost/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### POST `/users/login`
Authentifie un user
```bash
curl -X POST http://localhost/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### PUT `/users/:id`
Met à jour un user

### DELETE `/users/:id`
Supprime un user

---

## Exemple de fonctionnement

```bash
# 1. Lister les produits
curl http://localhost/products

# 2. Créer une commande
curl -X POST http://localhost/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "product_id": 1, "quantity": 1}'

# 3. Consulter les commandes
curl http://localhost/orders

# 4. Récupérer une commande spécifique
curl http://localhost/orders/1
```
