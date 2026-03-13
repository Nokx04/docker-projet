require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connexion db
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://orduser:ordpass123@localhost:5433/orders_db',
  {
    dialect: 'postgres',
    logging: false
  }
);

// url vers les api (A VOIR AVEC USERS QUAND RAPH AURA FINI)
const PRODUCTS_API_URL = process.env.PRODUCTS_API_URL || 'http://localhost:5002';
const USERS_API_URL = process.env.USERS_API_URL || 'http://localhost:5001';

// Orders
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
});


// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'orders-api' });
});

// GET orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET orders par ID
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET orders par l'ID du user
app.get('/orders/user/:user_id', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.params.user_id }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer order
app.post('/orders', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ 
        error: 'Champs requis: user_id, product_id, quantity' 
      });
    }
    
    // Appel API pour verif le produit et le stock
    let product;
    try {
      const productResponse = await axios.get(
        `${PRODUCTS_API_URL}/products/${product_id}`,
        { timeout: 5000 }
      );
      product = productResponse.data;
    } catch (error) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Check du stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }
    
    // Décrementer le stock avec API produits
    try {
      await axios.post(
        `${PRODUCTS_API_URL}/products/${product_id}/decrement-stock`,
        { quantity },
        { timeout: 5000 }
      );
    } catch (error) {
      return res.status(503).json({ 
        error: 'Erreur lors de la mise à jour du stock' 
      });
    }
    
    // Créer order
    const totalPrice = product.price * quantity;
    const order = await Order.create({
      user_id,
      product_id,
      quantity,
      total_price: totalPrice,
      status: 'confirmed'
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer db et serveur
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Orders API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });