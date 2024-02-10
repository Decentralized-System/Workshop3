//#region IMPORTS
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
//#endregion

//#region CONFIG
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3000;
app.listen(port, () => {
    console.log(`E-commerce API server is running at http://localhost:${port}`);
    console.log(`API documentation is available at http://localhost:${port}/api-docs`);
});
//#endregion

//#region 0. Database
let db = new sqlite3.Database('./ecommerce.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the ecommerce database.');
});

db.run(`CREATE TABLE IF NOT EXISTS products
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            name
            TEXT
            NOT
            NULL,
            description
            TEXT,
            price
            REAL,
            category
            TEXT,
            inStock
            BOOLEAN
        )`);

db.run(`CREATE TABLE IF NOT EXISTS orders
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            userId
            INTEGER,
            totalPrice
            REAL,
            status
            TEXT
        )`);

db.run(`CREATE TABLE IF NOT EXISTS orderItems
(
    orderId
    INTEGER,
    productId
    INTEGER,
    quantity
    INTEGER,
    FOREIGN
    KEY
        (
    orderId
        ) REFERENCES orders
        (
            id
        ),
    FOREIGN KEY
        (
            productId
        ) REFERENCES products
        (
            id
        )
    )`);

db.run(`CREATE TABLE IF NOT EXISTS carts
        (
            userId
            INTEGER
            PRIMARY
            KEY,
            totalPrice
            REAL
        )`);

db.run(`CREATE TABLE IF NOT EXISTS cartItems
(
    userId
    INTEGER,
    productId
    INTEGER,
    quantity
    INTEGER,
    FOREIGN
    KEY
        (
    userId
        ) REFERENCES carts
        (
            userId
        ),
    FOREIGN KEY
        (
            productId
        ) REFERENCES products
        (
            id
        )
    )`);

db.close();

//#endregion

//#region 1. Products Routes

/* GET /products
- **Description**: Retrieves a list of all products available in the store.
- **Request Body**: None.
- **Query Parameters**: Optional filters such as `category` to filter products by their category, and `inStock` to filter products based on their stock availability.
- **Response**: A JSON array of products, each containing details like name, description, price, and stock status. */
app.get('/products', async (req, res) => {
    const {category, inStock} = req.query;
    let sql = 'SELECT * FROM products';
    const params = [];
    const conditions = [];

    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (inStock) {
        conditions.push('inStock = ?');
        params.push(inStock === 'true' ? 1 : 0);
    }
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const rows = await dbQuery(sql, params, false);
        res.json(rows);
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

/* GET /products/:id
- **Description**: Fetches detailed information about a specific product identified by its ID.
- **Request Body**: None.
- **Response**: A JSON object containing detailed information of the product, including name, description, price, category, and stock status. */
app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';

    try {
        const row = await dbQuery(sql, [id], false);
        if (!row) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(row);
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

/* POST /products
- **Description**: Adds a new product to the store.
- **Request Body**: JSON object containing product information such as name, description, price, category, and stock status.
- **Response**: A JSON object of the created product, including all details provided plus a unique identifier for the product. */
app.post('/products', async (req, res) => {
    const {name, description, price, category, inStock} = req.body;
    const sql = 'INSERT INTO products (name, description, price, category, inStock) VALUES (?, ?, ?, ?, ?)';

    try {
        const lastId = await dbQuery(sql, [name, description, price, category, inStock], true);
        const product = {name, description, price, category, inStock, id: lastId};
        res.status(201).json(product);
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

/* PUT /products/:id
- **Description**: Updates the details of an existing product.
- **Request Body**: JSON object with the product's updated information. Only fields to be updated need to be included.
- **Response**: The updated product details as a JSON object. */
app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const {name, description, price, category, inStock} = req.body;
    const product = {name, description, price, category, inStock, id};
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, inStock = ? WHERE id = ?';

    try {
        const result = await dbQuery(sql, [
            product.name,
            product.description,
            product.price,
            product.category,
            product.inStock,
            id
        ]);
        if (result.changes === 0) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

/* DELETE /products/:id
- **Description**: Removes a product from the store by its ID.
- **Request Body**: None.
- **Response**: A confirmation message indicating successful deletion of the product. */
app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';

    try {
        const result = await dbQuery(sql, [id]);
        if (result.changes === 0) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

//#endregion

//#region 2. Orders Routes

/* POST /orders
- **Description**: Creates a new order with selected products.
- **Request Body**: JSON object containing an array of product IDs and their quantities, and optionally, user information if the system tracks orders per user without authentication.
- **Response**: Detailed information of the created order, including a unique order ID, list of products ordered with quantities, total price, and order status. */
app.post('/orders', async (req, res) => {
    const {userId, products, totalPrice, status} = req.body;
    const sql1 = 'INSERT INTO orders (userId, totalPrice, status) VALUES (?, ?, ?)';

    try {
        const id = await dbQuery(sql1, [userId, totalPrice, status], true);
        const sql2 = 'INSERT INTO orderItems (orderId, productId, quantity) VALUES (?, ?, ?)';
        for (const product of products) {
            await dbQuery(sql2, [id, product.productId, product.quantity], true);
        }
        res.json({id, userId, products, totalPrice, status});
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

/* GET /orders/:userId
- **Description**: Retrieves all orders placed by a specific user, identified by a user ID.
- **Request Body**: None.
- **Response**: An array of orders with detailed information about each order including order ID, products ordered, quantities, total price, and status. */
app.get('/orders/:userId', async (req, res) => {
    const {userId} = req.params;
    const sql1 = 'SELECT * FROM orders WHERE userId = ?';

    try {
        const rows = await dbQuery(sql1, [userId], false);
        for (const order of rows) {
            const sql2 = 'SELECT productId, quantity FROM orderItems WHERE orderId = ?';
            order.products = await dbQuery(sql2, [order.id], false);
        }
        res.json(rows);
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

//#endregion

//#region 3. Cart Routes

/* POST /cart/:userId
- **Description**: Adds a product to the user's shopping cart.
- **Request Body**: JSON object containing the product ID and quantity.
- **Response**: Updated contents of the cart, including product details and total price. */
app.post('/cart/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        // Select the user's cart, if it doesn't exist, create a new one
        const sqlCart = 'SELECT * FROM carts WHERE userId = ?';
        let cart = await dbQuery(sqlCart, [userId], false);
        if (!cart || cart.length === 0) {
            const sqlInsertCart = 'INSERT INTO carts (userId, totalPrice) VALUES (?, ?)';
            await dbQuery(sqlInsertCart, [userId, 0], true);
            cart = await dbQuery(sqlCart, [userId], false);
        }

        // Check if the product exists, if not return 404
        const {productId, quantity} = req.body;
        const sqlProduct = 'SELECT * FROM products WHERE id = ?';
        const product = await dbQuery(sqlProduct, [productId], false);
        if (!product || product.length === 0) {
            return res.status(404).json({message: 'Product not found'});
        }

        // Add the product to the cart or update the quantity if it already exists
        const sqlCartItem = 'SELECT * FROM cartItems WHERE userId = ? AND productId = ?';
        const cartItem = await dbQuery(sqlCartItem, [userId, productId], false);
        if (!cartItem || cartItem.length === 0) {
            const sqlInsertCartItem = 'INSERT INTO cartItems (userId, productId, quantity) VALUES (?, ?, ?)';
            await dbQuery(sqlInsertCartItem, [userId, productId, quantity], true);
        } else {
            const sqlUpdateCartItem = 'UPDATE cartItems SET quantity = ? WHERE userId = ? AND productId = ?';
            await dbQuery(sqlUpdateCartItem, [cartItem[0].quantity + quantity, userId, productId]);
        }

        // Update the cart's total price
        const sqlUpdateCart = 'UPDATE carts SET totalPrice = ? WHERE userId = ?';
        const oldTotalPrice = cart[0].totalPrice || 0;
        const newTotalPrice = oldTotalPrice + product[0].price * quantity;
        await dbQuery(sqlUpdateCart, [newTotalPrice, userId]);

        // Return the updated cart
        const sqlNewCart = 'SELECT * FROM carts WHERE userId = ?';
        const newCart = await dbQuery(sqlNewCart, [userId], false);
        const sqlNewCartItems = 'SELECT productId, quantity FROM cartItems WHERE userId = ?';
        for (const item of newCart) {
            item.products = await dbQuery(sqlNewCartItems, [userId], false);
        }
        res.json(newCart);
    } catch (error) {
        res.status(error.status).json({message: error.message});
    }
});

/* GET /cart/:userId
- **Description**: Retrieves the current state of a user's shopping cart.
- **Request Body**: None.
- **Response**: A JSON object listing the products in the cart, their quantities, and the total price. */
app.get('/cart/:userId', async (req, res) => {
    const {userId} = req.params;
    const sql = 'SELECT * FROM carts WHERE userId = ?';
    const cart = await dbQuery(sql, [userId], false);
    if (!cart || cart.length === 0) {
        return res.status(404).json({message: 'Cart not found'});
    }
    const sqlItems = 'SELECT productId, quantity FROM cartItems WHERE userId = ?';
    for (const item of cart) {
        item.products = await dbQuery(sqlItems, [userId], false);
    }
    res.json(cart);
});

/* DELETE /cart/:userId/item/:productId
- **Description**: Removes a specific product from the user's shopping cart.
- **Request Body**: None.
- **Response**: The updated contents of the cart after removal of the specified product. */
app.delete('/cart/:userId/item/:productId', async (req, res) => {
    const {userId, productId} = req.params;
    const sqlCheckCart = 'SELECT * FROM carts WHERE userId = ?';
    const cart = await dbQuery(sqlCheckCart, [userId], false);
    if (!cart || cart.length === 0) {
        return res.status(404).json({message: 'Cart not found'});
    }

    const sqlCheckProduct = 'SELECT * FROM products WHERE id = ?';
    const product = await dbQuery(sqlCheckProduct, [productId], false);
    if (!product || product.length === 0) {
        return res.status(404).json({message: 'Product not found'});
    }

    const sqlCheckCartItem = 'SELECT * FROM cartItems WHERE userId = ? AND productId = ?';
    const cartItem = await dbQuery(sqlCheckCartItem, [userId, productId], false);
    if (!cartItem || cartItem.length === 0) {
        return res.status(404).json({message: 'Product not found in cart'});
    }

    const sqlDeleteCartItem = 'DELETE FROM cartItems WHERE userId = ? AND productId = ?';
    await dbQuery(sqlDeleteCartItem, [userId, productId]);

    const sqlUpdateCart = 'UPDATE carts SET totalPrice = ? WHERE userId = ?';
    const oldTotalPrice = cart[0].totalPrice || 0;
    const newTotalPrice = oldTotalPrice - product[0].price * cartItem[0].quantity;
    await dbQuery(sqlUpdateCart, [newTotalPrice, userId]);

    const sqlNewCart = 'SELECT * FROM carts WHERE userId = ?';
    const newCart = await dbQuery(sqlNewCart, [userId], false);
    res.json(newCart);
});

//#endregion

//#region UTILS
function dbQuery(sql, params = [], isInsert = false) {
    return new Promise((resolve, reject) => {
        try {
            const db = new sqlite3.Database('./ecommerce.db', sqlite3.OPEN_READWRITE, err => {
                if (err) {
                    reject({status: 500, message: 'Error connecting to the database'});
                }
            });

            const callback = function (err, rows) {
                db.close();
                if (err) {
                    reject({status: 500, message: 'Internal server error'});
                } else {
                    resolve(isInsert ? this.lastID : rows);
                }
            };

            if (isInsert) {
                db.run(sql, params, callback);
            } else {
                db.all(sql, params, callback);
            }
        } catch (error) {
            reject({status: 500, message: 'Internal server error'});
        }
    });
}

//#endregion