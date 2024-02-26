"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../api/user");
const order_1 = require("../api/order");
const product_1 = require("../api/product");
const cart_1 = require("../api/cart");
const setupRoutes = (app) => {
    app.use('/products', product_1.default);
    app.use('/cart', cart_1.default);
    app.use('/user', user_1.default);
    app.use('/orders', order_1.default);
};
exports.default = setupRoutes;
//# sourceMappingURL=routes.js.map