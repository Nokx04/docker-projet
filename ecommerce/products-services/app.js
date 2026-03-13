require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connexion db
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://produser:prodpass123@db-products:5432/products_db',
  {
    dialect: 'postgres',
    logging: false
  }
);

// Produit
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'products',
  timestamps: false
});

// Synchroniser la base de données
sequelize.sync({ alter: true }).catch(err => console.error('Sync error:', err));

// Healthcheck (a verif si ça fonctionne)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'products-api' });
});

// GET produits
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET produits par ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer produit
app.post('/products', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Champs requis: name, price' });
    }
    
    const product = await Product.create({
      name,
      price,
      stock: stock || 0
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update produit
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    const { name, price, stock } = req.body;
    await product.update({
      name: name || product.name,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE produit
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    await product.destroy();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST décrémenter stock
app.post('/products/:id/decrement-stock', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    const { quantity } = req.body;
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }
    
    product.stock -= quantity;
    await product.save();
    
    res.json({
      id: product.id,
      stock_remaining: product.stock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start db et serveur
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Products API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });