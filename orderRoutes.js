// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route pour créer une nouvelle commande
router.post('/orders', async (req, res) => {
  const order = new Order({
    userId: req.body.userId,
    products: req.body.products,
    totalPrice: req.body.totalPrice,
    status: req.body.status,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour récupérer toutes les commandes d'un utilisateur
router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
