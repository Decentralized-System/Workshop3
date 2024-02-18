const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises'); 

const app = express();
const port = 3000;
const dbPath = 'C:/Users/Bernard/OneDrive - De Vinci/Desktop/.vs/OneDrive - De Vinci/A4/S8/Decentralization/TD3/Workshop3/data.json';

app.use(bodyParser.json());

// Load initial data from the JSON file
let { products, orders, carts } = require(dbPath);

// Products Routes

app.get('/products', (req, res) => {
    const { category, inStock } = req.query;

    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (inStock) {
        const inStockBool = inStock.toLowerCase() === 'true';
        filteredProducts = filteredProducts.filter(product => (inStockBool ? product.stock > 0 : true));
    }

    res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.post('/products', async (req, res) => {
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);

    await saveDataToFile();
    res.json(newProduct);
});

app.put('/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProductInfo = req.body;

    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProductInfo };
        await saveDataToFile();
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);

    await saveDataToFile();
    res.json({ message: 'Product deleted successfully' });
});

// Orders Routes

app.post('/orders', (req, res) => {
    const { products: orderProducts, user } = req.body;

    if (!orderProducts || !Array.isArray(orderProducts) || orderProducts.length === 0) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = {
        id: orders.length + 1,
        products: orderProducts.map(item => {
            const product = products.find(p => p.id === item.productId);
            return { ...product, quantity: item.quantity };
        }),
        user,
        totalPrice: orderProducts.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + product.price * item.quantity;
        }, 0),
        status: 'Pending'
    };

    orders.push(order);

    res.json(order);
});

app.get('/orders/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userOrders = orders.filter(order => order.user && order.user.id === userId);

    if (userOrders.length > 0) {
        res.json(userOrders);
    } else {
        res.status(404).json({ error: 'No orders found for the specified user ID' });
    }
});


// Cart Routes

app.post('/cart/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Invalid cart item data' });
    }

    const product = products.find(p => p.id === productId);

    if (!product || product.stock < quantity) {
        return res.status(404).json({ error: 'Product not found or insufficient stock' });
    }

    let userCart = carts.find(cart => cart.userId === userId);

    if (!userCart) {0
        userCart = { userId, items: [] };
        carts.push(userCart);
    }

    const existingCartItem = userCart.items.find(item => item.productId === productId);

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        userCart.items.push({ productId, quantity });
    }

    const updatedCart = {
        userId,
        items: userCart.items.map(item => ({
            ...item,
            product: products.find(p => p.id === item.productId)
        })),
        totalPrice: userCart.items.reduce((total, item) => {
            const itemProduct = products.find(p => p.id === item.productId);
            return total + itemProduct.price * item.quantity;
        }, 0)
    };

    res.json(updatedCart);
});

app.get('/cart/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userCart = carts.find(cart => cart.userId === userId);

    if (userCart) {
        res.json(userCart);
    } else {
        res.status(404).json({ error: 'Cart not found for the specified user ID' });
    }
});


app.delete('/cart/:userId/item/:productId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);

    const userCart = carts.find(cart => cart.userId === userId);

    if (!userCart) {
        return res.status(404).json({ error: 'User cart not found' });
    }

    userCart.items = userCart.items.filter(item => item.productId !== productId);

    const updatedCart = {
        userId,
        items: userCart.items.map(item => ({
            ...item,
            product: products.find(p => p.id === item.productId)
        })),
        totalPrice: userCart.items.reduce((total, item) => {
            const itemProduct = products.find(p => p.id === item.productId);
            return total + itemProduct.price * item.quantity;
        }, 0)
    };

    res.json(updatedCart);
});

const saveDataToFile = async () => {
    const dataToSave = { products, orders, carts };
    await fs.writeFile(dbPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
};

app.listen(port, () => {
    console.log(`E-commerce server is running on port ${port}`);
});
