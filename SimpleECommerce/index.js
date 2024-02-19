const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const products = []; // This will store our products
const orders = []; // This will store orders
const carts = {}; // This will store carts by userId

// Products Routes
app.get('/products', (req, res) => {
    // Add logic to filter by query parameters if needed
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    product ? res.json(product) : res.status(404).send({ message: "Product not found" });
});

app.post('/products', (req, res) => {
    // Add validation and error handling as needed
    const newProduct = { id: String(products.length + 1), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).send({ message: "Product not found" });
    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    res.json(updatedProduct);
});

app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).send({ message: "Product not found" });
    products.splice(index, 1);
    res.send({ message: "Product deleted" });
});

// Orders Routes
app.post('/orders', (req, res) => {
    // Example implementation. Add validation and improve as needed.
    const newOrder = { id: String(orders.length + 1), ...req.body };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.get('/orders/:userId', (req, res) => {
    const userOrders = orders.filter(order => order.userId === req.params.userId);
    res.json(userOrders);
});

// Cart Routes
app.post('/cart/:userId', (req, res) => {
    const { productId, quantity } = req.body;
    const cart = carts[req.params.userId] || [];
    cart.push({ productId, quantity });
    carts[req.params.userId] = cart;
    res.json(cart);
});

app.get('/cart/:userId', (req, res) => {
    res.json(carts[req.params.userId] || []);
});

app.delete('/cart/:userId/item/:productId', (req, res) => {
    const cart = carts[req.params.userId] || [];
    const index = cart.findIndex(item => item.productId === req.params.productId);
    if (index !== -1) cart.splice(index, 1);
    res.json(cart);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

