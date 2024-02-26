"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("../config/routes");
const user_model_1 = require("../config/models/user.model");
const product_model_1 = require("../config/models/product.model");
const cart_model_1 = require("../config/models/cart.model");
const order_model_1 = require("../config/models/order.model");
const productOrdered_model_1 = require("../config/models/productOrdered.model");
const sequelize_1 = require("sequelize");
var cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));
const sequelize = new sequelize_1.Sequelize('ecommerce', 'postgres', 'Password1*', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Connecté à la base de données PostgreSQL avec succès.');
        // Initialiser les modèles et synchroniser la base de données uniquement si la connexion à la base de données est établie avec succès
        user_model_1.default.initModel(sequelize);
        product_model_1.default.initModel(sequelize);
        cart_model_1.default.initModel(sequelize);
        order_model_1.default.initModel(sequelize);
        productOrdered_model_1.default.initModel(sequelize);
        yield sequelize.sync();
    }
    catch (error) {
        console.error('Erreur lors de la connexion à la base de données:', error);
        process.exit(1); // Arrêter le processus Node.js en cas d'erreur de connexion à la base de données
    }
}))();
(0, routes_1.default)(app);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map